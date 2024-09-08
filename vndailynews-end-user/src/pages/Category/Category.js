import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useNavigate, Link } from "react-router-dom";
import NewsByTag from "@components/CategoryPage/NewsByTags/NewByTag";
import NewsNewList from "@components/CategoryPage/NewsNewList/NewsNewList";
import RecommenNewsList from "@components/CategoryPage/RecommenNewsList/RecommenNewsList";
import LatestNewsList from "@components/LatestNewsList/LatestNewsList";
import NewsMostViewedList from "@components/CategoryPage/NewsMostViewedList/NewsMostViewedList";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import "./index.scss";
import images from "@assets/imgs";
import { fetchCategoryPage } from "../../services/newsService";
import Spinner from "react-bootstrap/Spinner";

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [newsNewList, setNewsNewList] = useState([]);
  const [newsMostViewedList, setNewsMostViewedList] = useState([]);
  const [newsByTagListOfCategory, setNewsByTagListOfCategory] = useState([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [hasMoreTags, setHasMoreTags] = useState(true); // kiểm soát khi nào cần tải dữ liệu

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const data = await fetchCategoryPage(id);
        if (data) {
          setCategory(data.category);
          setNewsNewList(data.newsNewList);
          setNewsMostViewedList(data.newsMostViewedList);
          setNewsByTagListOfCategory(data.newsByTagListOfCategory);
          setHasMoreTags(data.newsByTagListOfCategory.length > 0); // kiểm tra xem có thẻ ban đầu tồn tại chưa
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
          console.error("Có lỗi xảy ra khi gọi API:", error);
        }
      }
    };

    fetchCategoryData();
    window.scrollTo(0, 0);
    setPage(1); // đặt lại trang về 1 khi id thay đôi
    setHasMoreTags(true); // đặt lại khi id thay đổi
  }, [id, navigate]);

  useEffect(() => {
    const fetchMoreTags = async () => {
      if (!loadingTags || !hasMoreTags) return;
      setLoading(true);
      try {
        const data = await fetchCategoryPage(id, page);
        setNewsByTagListOfCategory((prevList) => [
          ...prevList,
          ...data.newsByTagListOfCategory,
        ]);
        setHasMoreTags(data.newsByTagListOfCategory.length > 0); // Check if there are more tags to load
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

  const title = category
    ? `${category.ten} - Hệ thống tin tức 24h`
    : "Đang tải...";
  useDocumentTitle(title);

  return (
    <div className="category-page container">
      <div className="header-category">
        <ul className="d-flex align-items-center mb-0">
          <li className="icon-home d-flex align-items-center">
            <a href="/" className="icon d-flex align-items-center">
              <img src={images.home} alt="home"></img>
              <span></span>
            </a>
            <div className="title-category">
              <a href={category.id}>{category.ten}</a>
            </div>
          </li>
          <div className="tags-wrapper">
            <div className={`tags ${showAllTags ? "show" : ""}`}>
              {newsByTagListOfCategory.slice(0, 5).map((newslist) => (
                <li key={newslist.id} className="tag">
                  <Link to={`/tags/${newslist.id}`}>{newslist.ten}</Link>
                </li>
              ))}
            </div>
            {newsByTagListOfCategory.length > 5 && (
              <>
                <div
                  className="more-tags"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? "✖️" : "•••"}
                </div>
                <div className={`hidden-tags ${showAllTags ? "show" : ""}`}>
                  {newsByTagListOfCategory.slice(5).map((newslist) => (
                    <a key={newslist.id} href={`/tags/${newslist.id}`}>
                      {newslist.ten}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
      <NewsNewList newsNewList={newsNewList} />
      <Row className="mt-5 responsive">
        <Col lg={9} md={12} className="content-left">
          <NewsMostViewedList newsMostViewedList={newsMostViewedList} />
          <NewsByTag newsByTagListOfCategory={newsByTagListOfCategory} />
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
      </Row>
      {loading && (
        <div className="loading-spinner">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
