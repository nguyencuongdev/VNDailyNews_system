import React, { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const PhotoSwipeComponent = ({ images }) => {
  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    // Tạo một đối tượng Image để lấy kích thước ảnh
    const loadImageSizes = async () => {
      const sizes = {};
      for (const image of images) {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
          sizes[image.src] = { width: img.width, height: img.height };
          if (Object.keys(sizes).length === images.length) {
            setImageSizes(sizes);
          }
        };
      }
    };

    loadImageSizes();
  }, [images]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#photo-swipe-gallery",
      children: "a:has(img)",
      pswpModule: () => import("photoswipe"),
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      wheelToZoom: true, // cho phép dùng con lăn để zoom ảnh
    });
    lightbox.init();

    return () => lightbox.destroy();
  }, []);

  return (
    <div id="photo-swipe-gallery">
      {images.map((image, index) => {
        const size = imageSizes[image.src] || { width: 750, height: 450 }; // Sử dụng kích thước mặc định nếu chưa có kích thước
        return (
          <a
            key={index}
            href={image.src}
            data-pswp-width={size.width}
            data-pswp-height={size.height}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image.src} alt={image.alt} width="750" height="450" />
          </a>
        );
      })}
    </div>
  );
};

export default PhotoSwipeComponent;
