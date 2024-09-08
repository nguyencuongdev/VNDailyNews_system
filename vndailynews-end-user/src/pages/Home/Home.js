import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { fetchDashboardNews } from "../../services/newsService";
import RecommenNewsList from "@components/RecommenNewsList/RecommenNewsList";
import LatestNewsList from "@components/LatestNewsList/LatestNewsList";
import Spinner from "react-bootstrap/Spinner";
import "./Home.scss";

function Home() {
  const [homedata, setNewsData] = useState([]);
  const [page, setPage] = useState(1);
  const [topViewedNews, setTopViewedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // kiểm soát khi nào cần tải dữ liệu
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đang ở trang chính
    setIsHomePage(window.location.pathname === "/");
  }, []);

  useEffect(() => {
    const getNewsData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardNews(page);
        if (data.length === 0) {
          setHasMore(false); // không còn dữ liệu mới
          setLoading(false);
          return;
        }
        setNewsData((prevData) => [...prevData, ...data]);
        setLoading(false);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
        setLoading(false);
      }
    };
    if (isHomePage) {
      getNewsData(page);
    }
  }, [page, isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        isHomePage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 2 &&
        hasMore
      ) {
        setLoading(true)
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isHomePage]);

  useEffect(() => {
    if (!topViewedNews && homedata.length > 0 && homedata[0].news.length > 0) {
      setTopViewedNews(homedata[0].news[0]);
    }
  }, [homedata, topViewedNews]);

  useDocumentTitle("Trang chủ - Hệ thống tin tức 24h");

  return (
    <Container className="content home-page">
      <Row>
        <Col lg={9} md={12} sm={12} className="content-left">
          {topViewedNews && (
            <Row className="top_news-view">
              <Col xl={6} lg={12} className="img">
                <Link to={`/newsdetail/${topViewedNews.id}`}>
                  <img
                    src={topViewedNews.anhdaidien}
                    alt={topViewedNews.tieude}
                  ></img>
                </Link>
              </Col>
              <Col xl={6} lg={12} className="">
                <div className="title">
                  <Link
                    to={`/newsdetail/${topViewedNews.id}`}
                    className="main-title"
                  >
                    {topViewedNews.tieude}
                  </Link>
                  <p className="summary-content">
                    {topViewedNews.noidungtomtat}
                  </p>
                </div>
              </Col>
            </Row>
          )}
          <Row className="news-by-category">
            {homedata.slice(0, 4).map(
              (category) =>
                category.news.length > 0 && (
                  <Col md={6} lg={12} key={category.id} className="home">
                    <div className="category-and-tag d-flex align-items-center">
                      <div className="title-category">
                        <a
                          href={`/categorys/${category.id}`}
                          className="category m-0"
                        >
                          {category.ten}
                        </a>
                      </div>
                      <ul className="tags">
                        {category.tags.map((tag) => (
                          <li key={tag.id}>
                            <Link to={`/tags/${tag.id}`}>{tag.ten}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="news">
                      {category.news.slice(0, 4).map((newsItem, index) => (
                        <div key={newsItem.id}>
                          <div className="img">
                            <Link to={`/newsdetail/${newsItem.id}`}>
                              <img
                                src={newsItem.anhdaidien}
                                alt={newsItem.tieude}
                              ></img>
                            </Link>
                          </div>
                          <div className="title">
                            <Link
                              to={`/newsdetail/${newsItem.id}`}
                              className="main-title"
                            >
                              {newsItem.tieude}
                            </Link>
                            {index === 0 && (
                              <p className="summary-content ">
                                {newsItem.noidungtomtat}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                )
            )}
          </Row>
        </Col>
        <Col lg={3} md={12} className="content-right">
          <Row>
            <Col lg={12} className="mb-3">
              <LatestNewsList />
            </Col>
            <Col lg={12} className="recommen">
              <RecommenNewsList setTopViewedNews={setTopViewedNews} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col div className="news-by-category2">
          {homedata.slice(4).map(
            (category) =>
              category.news.length > 0 && (
                <div key={category.id} className="home">
                  <div className="category-and-tag d-flex align-items-center">
                    <div className="title-category">
                      <a
                        href={`/categorys/${category.id}`}
                        className="category m-0"
                      >
                        {category.ten}
                      </a>
                    </div>
                    <ul className="tags">
                      {category.tags.map((tag) => (
                        <li key={tag.id}>
                          <Link to={`/tags/${tag.id}`}>{tag.ten}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="news">
                    {category.news.slice(0, 4).map((newsItem, index) => (
                      <div key={newsItem.id}>
                        <div className="img">
                          <Link to={`/newsdetail/${newsItem.id}`}>
                            <img
                              src={newsItem.anhdaidien}
                              alt={newsItem.tieude}
                            ></img>
                          </Link>
                        </div>
                        <div className="title">
                          <Link
                            to={`/newsdetail/${newsItem.id}`}
                            className="main-title"
                          >
                            {newsItem.tieude}
                          </Link>
                          {index === 0 && (
                            <p className="summary-content ">
                              {newsItem.noidungtomtat}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </Col>
      </Row>
      {loading && (
        <div className="loading-spinner">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
}

export default Home;
