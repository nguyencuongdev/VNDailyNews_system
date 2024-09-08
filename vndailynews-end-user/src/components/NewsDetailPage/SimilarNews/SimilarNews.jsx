// src/components/SimilarNews.js
import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import "./SimilarNews.scss"
const SimilarNews = ({ newsSimilarList }) => {
  // props lấy dữ liệu được truyền từ component newsdetailpage
  // console.log(newsSimilarList)
  return (
    <div className="similar-articles container ">
      {/* <h2>Bài viết tương tự</h2> */}
      <div>
        {newsSimilarList.map((news) => (
          <Row key={news.id} className="news-item">
            <div className="images">
              <a href={`/newsdetail/${news.id}`}>
                <img src={news.anhdaidien} alt={news.tieude}></img>
              </a>
            </div>
            <div >
              <div className="main-title">
                <Link to={`/newsdetail/${news.id}`}> {news.tieude}</Link>
              </div>
              <p className="summary-content">{news.noidungtomtat}</p>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
};

export default SimilarNews;
