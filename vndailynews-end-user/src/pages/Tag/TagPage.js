// TagPages

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { fetchTagData } from "../../services/newsService";
import RecommenNewsList from "@components/CategoryPage/RecommenNewsList/RecommenNewsList";
import LatestNewsList from "@components/LatestNewsList/LatestNewsList";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import CurrentTime from "../../components/CurrentTime";
import Spinner from "react-bootstrap/Spinner";
import "./index.scss";

function TagPage() {
  const { id } = useParams();
  const [tag, setTag] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [hasMoreTags, setHasMoreTags] = useState(true); // kiểm soát khi nào cần tải dữ liệu

  const navigate = useNavigate();

  useEffect(() => {
    const getTagData = async () => {
      try {
        const data = await fetchTagData(id);
        if (data) {
          setTag(data.tag);
          setCategory(data.category);
          setNewsList(data.newsList);
          setHasMoreTags(data.newsList.length > 0);
        } else {
          navigate("*");
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 403)
        ) {
          navigate("/404");
        } else {
          console.error("Error fetching tag data:", error);
        }
      }
    };

    getTagData();
    window.scrollTo(0, 0);
    setPage(1); // đặt lại trang về 1 khi id thay đôi
    setHasMoreTags(true); // đặt lại khi id thay đổi
  }, [id, navigate]);

  useEffect(() => {
    const fetchMoreTags = async () => {
      if (!loadingTags || !hasMoreTags) return;
      setLoading(true);
      try {
        const data = await fetchTagData(id, page);
        setNewsList((prevList) => [...prevList, ...data.newsList]);
        setHasMoreTags(data.newsList.length > 0); // Check if there are more tags to load
        setLoading(false);
        setLoadingTags(false); // Reset loadingTags after fetching
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
        setLoading(false);
        setLoadingTags(false); // Reset loadingTags even on error
      }
    };

    if (page > 1) {
      fetchMoreTags();
    }
  }, [id, page, loadingTags, hasMoreTags]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 2 &&
        hasMoreTags
      ) {
        setLoadingTags(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMoreTags]);

  useDocumentTitle(tag ? `${tag.ten} - Hệ thống tin tức 24h` : "Đang tải...");

  if (newsList.length === 0) {
    return <div className="container content">chưa có bài viết</div>;
  }

  if (!tag || !category) {
    return (
      <div className="container content">
        <div className="loading-spinner">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  return (
    <div className="container tags-page content">
      <Row className="responsive">
        <Col lg={9} md={12} className="content-left">
          <div className="d-flex justify-content-between nav">
            <ul className="d-flex">
              <li>
                <Link to="/" className="home">
                  Trang chủ
                </Link>
              </li>
              <li className="tags">
                <Link to={`/tags/${tag.id}`} key={tag.id} className="tag pl-2">
                  {tag.ten}
                </Link>
              </li>
            </ul>
            <div className="time">
              <CurrentTime />
            </div>
          </div>
          <h3>{tag.ten}</h3>
          <div className=" col desktop">
            {newsList.map((news, index) => (
              <Row
                key={news.id}
                className={`news-item ${index === 0 ? "first-news-item" : ""}`}
              >
                <div className="images">
                  <a href={`/newsdetail/${news.id}`}>
                    <img src={news.anhdaidien} alt={news.tieude}></img>
                  </a>
                </div>
                <div className="title">
                  <div className="main-title">
                    <a href={`/newsdetail/${news.id}`}> {news.tieude}</a>
                  </div>
                  <p className="summary-content">{news.noidungtomtat}</p>
                </div>
              </Row>
            ))}
          </div>
          <div className="mobile">
            {newsList.map((news, index) => (
              <div
                key={news.id}
                className={`news-item news-item-${index + 1}`}
              >
                <div className="imgs">
                <Link to={`/newsdetail/${news.id}`}>
                  <img src={news.anhdaidien} alt={news.tieude}></img>
                </Link>
                </div>
                <div className="title">
                  <Link
                    to={`/newsdetail/${news.id}`}
                    className="main-title"
                  >
                    {news.tieude}
                  </Link>
                </div>
                {/* <p>{newslist.noidungtomtat}</p> */}
              </div>
            ))}
          </div>
        </Col>
        <Col lg={3} md={12} className="content-right">
          <Row>
            <Col lg={12} md={6} className="mb-3">
              <LatestNewsList />
            </Col>
            <Col lg={12} md={6}>
              <RecommenNewsList />
            </Col>
          </Row>
        </Col>
        {loading && (
          <p>
            <div className="loading-spinner">
              <Spinner animation="border" />
            </div>
          </p>
        )}
      </Row>
    </div>
  );
}

export default TagPage;
