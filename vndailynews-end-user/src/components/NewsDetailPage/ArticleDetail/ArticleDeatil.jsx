import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Article.scss";
import CurrentTime from "../../CurrentTime";
import "froala-editor/css/froala_editor.pkgd.min.css";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import PhotoSwipeComponent from "../PhotoSwipe"; // Đảm bảo đường dẫn chính xác

const ArticleDetail = ({ inforNews, tags }) => {
  const renderContent = (content, index) => {
    switch (content.type) {
      case "text default":
        return <p key={index}>{content.value}</p>;
      case "text italic":
        return (
          <p key={index} style={{ fontStyle: "italic" }}>
            {content.value}
          </p>
        );
      case "text bold":
        return (
          <p key={index} style={{ fontWeight: "bold" }}>
            {content.value}
          </p>
        );
      case "title default":
        return <h2 key={index}>{content.value}</h2>;
      case "title italic":
        return (
          <h2 key={index} style={{ fontStyle: "italic" }}>
            {content.value}
          </h2>
        );
      case "title bold":
        return (
          <h2 key={index} style={{ fontWeight: "bold" }}>
            {content.value}
          </h2>
        );
      case "image":
        return (
          <div className="images" key={index}>
            <PhotoSwipeComponent
              images={[
                {
                  src: content.src,
                  alt: content.name,
                },
              ]}
            />
            {content.name && <p className="image-name">{content.name}</p>}
          </div>
        );
      case "video":
        return (
          <div className="video-container" key={content.src}>
            <video
              controls
              width="100%"
              onError={(e) => {
                e.target.outerHTML =
                  '<p class="video-error">Video không khả dụng.</p>';
              }}
            >
              <source
                src={content.src}
                type="video/mp4"
                onError={(e) => {
                  e.target.parentNode.outerHTML =
                    '<p class="video-error">Video không khả dụng.</p>';
                }}
              />
            </video>
            {content.name && <p className="video-name">{content.name}</p>}
          </div>
        );
      case "audio":
        return (
          <div className="audio-container" key={content.src}>
            <audio
              controls
              width="100%"
              onError={(e) => {
                e.target.outerHTML =
                  '<p class="audio-error">Âm thanh không khả dụng.</p>';
              }}
            >
              <source
                src={content.src}
                type="audio/mpeg"
                onError={(e) => {
                  e.target.parentNode.outerHTML =
                    '<p class="audio-error">Âm thanh không khả dụng.</p>';
                }}
              />
            </audio>
            {content.name && <p className="audio-name">{content.name}</p>}
          </div>
        );
      case "richtext":
        return (
          <div
            key={index}
            className="richtext-content"
            dangerouslySetInnerHTML={{ __html: content.value }}
          />
        );
      default:
        return null;
    }
  };

  const contentDetails = JSON.parse(inforNews.noidungchitiet);

  useEffect(() => {
    const images = document.querySelectorAll(".richtext-content img");
    images.forEach((img) => {
      const link = document.createElement("a");
      link.href = img.src;
      link.setAttribute("data-pswp-width", img.naturalWidth);
      link.setAttribute("data-pswp-height", img.naturalHeight);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    });

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#photo-swipe-gallery",
      children: "a:has(img)",
      pswpModule: () => import("photoswipe"),
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      wheelToZoom: true,
    });
    lightbox.init();

    return () => lightbox.destroy();
  }, [inforNews]);

  return (
    <div className="article-detail ">
      <div className="d-flex justify-content-between nav">
        <ul className="d-flex">
          <li>
            <Link to="/" className="home">
              Trang chủ
            </Link>
          </li>
          <li className="tags">
            {tags &&
              tags.map((tag) => (
                <Link to={`/tags/${tag.id}`} key={tag.id} className="tag pl-2">
                  {tag.ten}
                </Link>
              ))}
          </li>
        </ul>
        <div className="time">
          <CurrentTime />
        </div>
      </div>
      <p className="title">{inforNews.tiede}</p>
      <p className="summary-content">
        <strong>{inforNews.noidungtomtat}</strong>
      </p>
      <div id="photo-swipe-gallery" className="content-details fr-view">
        {Array.isArray(contentDetails) &&
          contentDetails.map((content, index) => renderContent(content, index))}
      </div>
      <div className="posting-date">
      <p>Ngày đăng: {inforNews.ngaydang}</p>
      </div>
    </div>
  );
};

export default ArticleDetail;
