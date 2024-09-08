import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../../SearchContext";
import images from "@assets/imgs";
import "./Header.scss";
import CurrentTime from "../../CurrentTime";
import BACKEND_URL from "../../../config/backendUrl";
// import Weather from "../../Weather/Weather";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { MenuAccount } from "./MenuAccount";
import { useMenuContext } from "../../MenuContext";

function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null); // Tạo ref cho input tìm kiếm
  const { closeMenu } = useMenuContext();

  let checkLogin = false;
  const accessToken = Cookies.get("accessToken") || "";
  let userInfor = null;
  if (accessToken) {
    try {
      const tokenDecode = jwtDecode(accessToken);
      userInfor = {
        tenhienthi: tokenDecode?.tenhienthi,
        id: tokenDecode?.id,
        vaitro_id: tokenDecode?.vaitro_id,
      };
      checkLogin = tokenDecode.exp > Date.now() / 1000; // kiểm tra xem người dùng đã login chưa và token còn thời gian sống hay không;
    } catch (err) {
      checkLogin = false;
    }
  }

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
    setSearchTerm(""); // Xóa giá trị của searchTerm
    searchInputRef.current.focus(); // Focus vào input sau khi tìm kiếm
    closeMenu();

    // searchInputRef.current.blur(); // Rời khỏi input sau khi tìm kiếm

  };

  // const handleInputFocus = () => {
  //   setSearchTerm(""); 
  // };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="header-top container">
      <div className={`header-top-scroll ${isScrolled ? "scrolled" : ""}`}>
        {/* <div className="container d-flex justify-content-between"> */}
          <div className="logo-time">
            <Link to="/" className="logo">
              <img src={images.logo} alt="VNDailyNews" />
            </Link>
            <div className="time">
              <span>
                <CurrentTime />
              </span>
            </div>
            {/* <Weather /> */}
          </div>
          <div className="d-flex align-items-center">
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
              <input
                className="form-control"
                placeholder="Tìm kiếm..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
                // onFocus={handleSearch}
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M20.7144 17.5531L16.6248 13.6161C16.4403 13.4384 16.1901 13.3397 15.9275 13.3397H15.2589C16.391 11.9457 17.0637 10.1924 17.0637 8.28514C17.0637 3.74791 13.2449 0.0715332 8.53187 0.0715332C3.81883 0.0715332 0 3.74791 0 8.28514C0 12.8224 3.81883 16.4987 8.53187 16.4987C10.5131 16.4987 12.3343 15.8511 13.7823 14.7613V15.4049C13.7823 15.6576 13.8848 15.8985 14.0694 16.0762L18.1589 20.0132C18.5445 20.3844 19.168 20.3844 19.5495 20.0132L20.7103 18.8957C21.0959 18.5245 21.0959 17.9243 20.7144 17.5531ZM8.53187 13.3397C5.63186 13.3397 3.28149 11.0809 3.28149 8.28514C3.28149 5.4933 5.62776 3.23061 8.53187 3.23061C11.4319 3.23061 13.7823 5.48935 13.7823 8.28514C13.7823 11.077 11.436 13.3397 8.53187 13.3397Z"
                    fill="#7DC115"
                  />
                </svg>
              </button>
            </form>
            {checkLogin && userInfor ? (
              <MenuAccount userInfor={userInfor} />
            ) : (
              <a href={`${BACKEND_URL}/login`} className="login h-100 btn">
                Đăng nhập
              </a>
            )}
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default Header;
