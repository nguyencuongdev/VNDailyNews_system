import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

const NewsSlider = ({ newsMostViewedList }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "25px", // Điều chỉnh số px trượt giữa các slide
    arrows: true, // Hiển thị các nút điều hướng
  };
  // Kiểm tra xem có bài viết nào không
  if (newsMostViewedList.length === 0) {
    return <div>chưa có bài viết</div>;
  }
  if (newsMostViewedList.length < 3) {
    return (
      <div className="news-list d-flex ">
      <h4>NHIỀU NGƯỜI ĐỌC</h4>
        {newsMostViewedList.map((newslist) => (
          <div key={newslist.id} className="news-item">
            <Link to={`/newsdetail/${newslist.id}`}>
              <img src={newslist.anhdaidien} alt={newslist.tieude} />
            </Link>
            <div className="title">
              <Link to={`/newsdetail/${newslist.id}`} className="main-title">
                {newslist.tieude}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="news-slider">
      <h4>NHIỀU NGƯỜI ĐỌC</h4>
      <Slider {...settings}>
        {newsMostViewedList.map((newslist) => (
          <div key={newslist.id} className="news-item">
            <Link to={`/newsdetail/${newslist.id}`}>
              <img src={newslist.anhdaidien} alt={newslist.tieude} />
            </Link>
            <div className="title">
              <Link to={`/newsdetail/${newslist.id}`} className="main-title">
                {newslist.tieude}
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsSlider;
