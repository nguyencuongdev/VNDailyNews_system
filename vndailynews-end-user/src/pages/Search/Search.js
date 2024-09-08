// SearchPage.js
import React, { useEffect } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useLocation } from "react-router-dom";
import LatestNewsList from "@components/LatestNewsList/LatestNewsList";
import RecommenNewsList from "@components/CategoryPage/RecommenNewsList/RecommenNewsList";
import CurrentTime from "../../components/CurrentTime";
import API_ENDPOINTS from "../../config/api";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Spinner from "react-bootstrap/Spinner";
import "./index.scss";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const searchValue = query.get("query");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.NEWS}/by-search?limit=10&page=1&searchValue=${searchValue}`
        );
        const data = response.data;

        if (data && Array.isArray(data.newsList)) {
          setResults(data.newsList);
        } else {
          setResults([]);
          console.error("Unexpected response format: ", data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchValue]);

  useDocumentTitle("Tìm kiếm - Hệ thống tin tức 24h");

  if (loading)
    return (
      <p className="container content">
        <div className="loading-spinner">
          <Spinner animation="border" />
        </div>
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container content search_page">
      <Row>
        <Col lg={9} className="main-search">
          <div className="d-flex justify-content-between nav">
            <ul className="d-flex">
              <li>
                <Link to="/" className="home">
                  Trang chủ
                </Link>
              </li>
              <li className="tags">
                <span className="tag">Search</span>
              </li>
            </ul>
            <div className="time">
              <CurrentTime />
            </div>
          </div>
          <h3>Kết quả tìm kiếm cho "{searchValue}"</h3>
          <ul>
            {results.map((news) => (
              <Row key={news.id} className="news-item">
                <div className="images">
                  <Link to={`/newsdetail/${news.id}`}>
                    <img src={news.anhdaidien} alt={news.tieude}></img>
                  </Link>
                </div>
                <div>
                  <div className="main-title">
                    <Link to={`/newsdetail/${news.id}`}> {news.tieude}</Link>
                  </div>
                  <p className="summary-content">{news.noidungtomtat}</p>
                </div>
              </Row>
            ))}
          </ul>
        </Col>
        <Col lg={3}>
          <LatestNewsList />
          <RecommenNewsList />
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
