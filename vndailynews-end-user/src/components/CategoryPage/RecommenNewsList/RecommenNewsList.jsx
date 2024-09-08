import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import { Link, useNavigate } from "react-router-dom";
import { fetchRecommendedNews } from "../../../services/newsService";
function RecommenNewsList() {
  const [newslist, setNews] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getRecommendedNews = async () => {
      try {
        const data = await fetchRecommendedNews();
        setNews(data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      }
    };
    getRecommendedNews();
  }, []);

  const handleShowMore = () => {
    navigate("/recommendednews"); // Điều hướng đến trang chi tiết bài viết đề xuất
  };

  if (newslist.length === 0) {
    return null;
  }

  return (
    <div className="latest_news-list">
      <div className="title-latest-news">
        <Link to="/recommendednews">Tin tức đề xuất</Link>
      </div>
      {newslist.slice(0, 5).map((news) => (
        <div key={news.id} className="news-item">
          <Row className="main-news">
            <div className="image">
              <Link to={`/newsdetail/${news.id}`}>
                <img
                  src={news.anhdaidien}
                  alt={news.tieude}
                  className="news-image"
                />
              </Link>
            </div>
            <div className="title">
              <Link to={`/newsdetail/${news.id}`} className="main-title">
                <p>{news.tieude}</p>
              </Link>
            </div>
          </Row>
        </div>
      ))}
      {newslist.length > 5 && (
        <button className="see-more-button" onClick={handleShowMore}>
          <span>Xem thêm</span>
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
          >
            <path
              d="M8.70711 8.70711C9.09763 8.31658 9.09763 7.68342 8.70711 7.29289L2.34315 0.928932C1.95262 0.538408 1.31946 0.538408 0.928932 0.928932C0.538408 1.31946 0.538408 1.95262 0.928932 2.34315L6.58579 8L0.928932 13.6569C0.538408 14.0474 0.538408 14.6805 0.928932 15.0711C1.31946 15.4616 1.95262 15.4616 2.34315 15.0711L8.70711 8.70711ZM6.5 9H8V7H6.5V9Z"
              fill="white"
              className="icon-path"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default RecommenNewsList;
