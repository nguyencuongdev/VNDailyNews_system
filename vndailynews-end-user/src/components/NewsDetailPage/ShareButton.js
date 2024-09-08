import React from "react";
import images from "@assets/imgs";
import "./index.scss";
import fb from "../../assets/imgs/fb.png";
import zalo from "../../assets/imgs/zalo.png";
import mess from "../../assets/imgs/mess.png";

const ShareButton = ({ url }) => {
  const handleShare = (platform) => {
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "zalo":
        shareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
        break;
      case "messenger":
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
          url
        )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="dropdown share-dropdown">
      <button
        className="btn btn-secondary dropdown-toggle share-button"
        type="button"
        data-toggle="dropdown"
        aria-expanded="false"
      >
        <img src={images.share} alt="share icon" />
        <span>CHIA SẺ</span>
      </button>
      <div className="dropdown-menu icon-social">
        <button
          onClick={() => handleShare("facebook")}
          className="dropdown-item icon"
        >
          <img src={fb} alt="facebook" /> Facebook
        </button>
        <button
          onClick={() => handleShare("zalo")}
          className="dropdown-item icon"
        >
          <img src={zalo} alt="zalo" /> Zalo
        </button>
        <button
          onClick={() => handleShare("messenger")}
          className="dropdown-item icon"
        >
          <img src={mess} alt="messenger" /> Messenger
        </button>
      </div>
    </div>
  );
};

export default ShareButton;
