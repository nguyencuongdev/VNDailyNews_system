import React from "react";
import { Link } from "react-router-dom";
import "./NewsNewList.scss";
function Test({ newsNewList }) {
  if (newsNewList.length === 0) {
    return <div>chưa có bài viết</div>; // Không render component nếu không có bài viết
  }
  return (
    <div className="newsNewList">
      <div className="desktop">
        {newsNewList.map((news, index) => (
          <div key={news.id} className={`news-item news-item-${index + 1}`}>
            <Link to={`/newsdetail/${news.id}`}>
              <img src={news.anhdaidien} alt={news.tieude}></img>
            </Link>
            <div className="title">
              <Link to={`/newsdetail/${news.id}`} className="main-title">
                {news.tieude}
              </Link>
            </div>
            {/* <p>{newslist.noidungtomtat}</p> */}
          </div>
        ))}
      </div>
      <div className="mobile">
        {newsNewList.map((newslist, index) => (
          <div key={newslist.id} className={`news-item news-item-${index + 1}`}>
            <div className="imgs">
              <Link to={`/newsdetail/${newslist.id}`}>
                <img src={newslist.anhdaidien} alt={newslist.tieude}></img>
              </Link>
            </div>
            <div className="title">
              <Link to={`/newsdetail/${newslist.id}`} className="main-title">
                {newslist.tieude}
              </Link>
            </div>
            {/* <p>{newslist.noidungtomtat}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Test;
