import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import "./index.scss";
function NewsByTag({ newsByTagListOfCategory }) {
  if (newsByTagListOfCategory.length === 0) {
    return <div>chưa có bài viết</div>;
  }
  return (
    <div className="news-by-tag mt-5">
      {newsByTagListOfCategory.map(
        (newslist) =>
          newslist.news.length > 0 && (  // thể loại nào không có bài đăng thì sẽ không hiển thị
            <Col key={newslist.id} className="mt-5">
              <h3 className="row"><Link to={`/tags/${newslist.id}`}>{newslist.ten}</Link></h3>
              {newslist.news.map((news) => (
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
            </Col>
          )
      )}
    </div>
  );
}

export default NewsByTag;
