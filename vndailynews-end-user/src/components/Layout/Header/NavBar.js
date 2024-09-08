import React, { useState, useEffect, useRef } from "react";
import { fetchCategory } from "../../../services/newsService";
import { Link, useNavigate } from "react-router-dom";
import { useMenuContext } from "../../MenuContext";
import { useSearch } from "../../SearchContext";
import images from "@assets/imgs";
import "./Header.scss";

function Header() {
  const [category, setCategories] = useState([]);
  const { isMenuOpen, toggleMenu, closeMenu } = useMenuContext();
  const { searchTerm, setSearchTerm } = useSearch();
  const searchInputRef = useRef(null); // Tạo ref cho input tìm kiếm
  const navigate = useNavigate();
  const [openTags, setOpenTags] = useState({}); // State để theo dõi hiển thị tags

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      }
    };
    getCategories();
  }, []);

  const handleMenuToggle = () => {
    toggleMenu();
  };

  const handleCloseMenu = () => {
    closeMenu();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
    setSearchTerm(""); // Xóa giá trị của searchTerm
    searchInputRef.current.focus(); // Focus vào input sau khi tìm kiếm
    closeMenu();
  };

    // Toggle hiển thị tags khi nhấn vào icon
  const toggleTags = (categoryId) => {
    setOpenTags((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className="header-bottom ">
      <div className="desktop container d-flex justify-content-between">
        <nav className="navbar navbar-expand-lg">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <div className="logo">
                <Link to="/" className="logo">
                  <img src={images.logo1} alt="logo"></img>
                </Link>
              </div>
              <div className="icon-actions">
                <li className="click_on_off_menu" onClick={handleMenuToggle}>
                  <Link to="#">
                    {isMenuOpen ? (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="19.0918"
                          y="22.0919"
                          width="27"
                          height="4"
                          transform="rotate(-135 19.0918 22.0919)"
                          fill="white"
                        />
                        <rect
                          x="0.0917969"
                          y="19.0919"
                          width="27"
                          height="4"
                          transform="rotate(-45 0.0917969 19.0919)"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="19"
                        viewBox="0 0 22 19"
                        fill="none"
                      >
                        <path
                          d="M0.78125 3.4898H21.0938C21.5252 3.4898 21.875 3.14261 21.875 2.71429V0.77551C21.875 0.347186 21.5252 0 21.0938 0H0.78125C0.349756 0 0 0.347186 0 0.77551V2.71429C0 3.14261 0.349756 3.4898 0.78125 3.4898ZM0.78125 11.2449H21.0938C21.5252 11.2449 21.875 10.8977 21.875 10.4694V8.53061C21.875 8.10229 21.5252 7.7551 21.0938 7.7551H0.78125C0.349756 7.7551 0 8.10229 0 8.53061V10.4694C0 10.8977 0.349756 11.2449 0.78125 11.2449ZM0.78125 19H21.0938C21.5252 19 21.875 18.6528 21.875 18.2245V16.2857C21.875 15.8574 21.5252 15.5102 21.0938 15.5102H0.78125C0.349756 15.5102 0 15.8574 0 16.2857V18.2245C0 18.6528 0.349756 19 0.78125 19Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </Link>
                </li>
                <li className="icon-home" onClick={handleCloseMenu}>
                  <Link to="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="19"
                      viewBox="0 0 26 19"
                      fill="none"
                    >
                      <path
                        d="M13.0445 4.9291L5.04232 11.3699V18.3214C5.04232 18.5013 5.11548 18.674 5.24572 18.8012C5.37595 18.9285 5.55258 19 5.73676 19L10.6005 18.9877C10.7841 18.9868 10.9598 18.9149 11.0893 18.7877C11.2188 18.6606 11.2915 18.4885 11.2914 18.3091V14.2495C11.2914 14.0695 11.3646 13.8969 11.4948 13.7696C11.6251 13.6423 11.8017 13.5708 11.9859 13.5708H14.7637C14.9478 13.5708 15.1245 13.6423 15.2547 13.7696C15.385 13.8969 15.4581 14.0695 15.4581 14.2495V18.3061C15.4578 18.3954 15.4756 18.4839 15.5104 18.5664C15.5451 18.649 15.5962 18.7241 15.6607 18.7873C15.7253 18.8506 15.8019 18.9008 15.8863 18.935C15.9707 18.9692 16.0612 18.9869 16.1526 18.9869L21.0145 19C21.1987 19 21.3754 18.9285 21.5056 18.8012C21.6358 18.674 21.709 18.5013 21.709 18.3214V11.3652L13.7085 4.9291C13.6145 4.85501 13.4973 4.81461 13.3765 4.81461C13.2557 4.81461 13.1385 4.85501 13.0445 4.9291ZM25.6847 9.3068L22.0562 6.38395V0.508985C22.0562 0.373994 22.0013 0.244532 21.9037 0.149078C21.806 0.0536252 21.6735 0 21.5354 0H19.1048C18.9667 0 18.8342 0.0536252 18.7365 0.149078C18.6389 0.244532 18.584 0.373994 18.584 0.508985V3.58877L14.6981 0.464449C14.3252 0.164563 13.8573 0.000599477 13.3743 0.000599477C12.8914 0.000599477 12.4235 0.164563 12.0506 0.464449L1.06402 9.3068C1.01128 9.3494 0.967645 9.40173 0.93561 9.46082C0.903575 9.5199 0.883768 9.58458 0.877319 9.65115C0.87087 9.71772 0.877906 9.78487 0.898025 9.84878C0.918144 9.91269 0.950952 9.9721 0.994574 10.0236L2.10134 11.3385C2.14485 11.3902 2.19836 11.433 2.25881 11.4645C2.31926 11.4959 2.38547 11.5154 2.45364 11.5218C2.52181 11.5283 2.59061 11.5215 2.6561 11.5019C2.72159 11.4823 2.78248 11.4503 2.83529 11.4076L13.0445 3.19007C13.1385 3.11598 13.2557 3.07557 13.3765 3.07557C13.4973 3.07557 13.6145 3.11598 13.7085 3.19007L23.9182 11.4076C23.9709 11.4503 24.0317 11.4823 24.0971 11.502C24.1625 11.5216 24.2312 11.5285 24.2993 11.5222C24.3674 11.5159 24.4336 11.4966 24.4941 11.4653C24.5545 11.434 24.6081 11.3913 24.6517 11.3398L25.7585 10.0249C25.802 9.97308 25.8347 9.91336 25.8546 9.84917C25.8745 9.78498 25.8812 9.71759 25.8743 9.65086C25.8675 9.58412 25.8472 9.51938 25.8146 9.46033C25.7821 9.40129 25.7379 9.34911 25.6847 9.3068Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </li>
              </div>
              <div className={`menu ${isMenuOpen ? "show-menu" : ""}`}>
                {category.slice(0, 10).map((category) => (
                  <li
                    key={category.id}
                    className="nav-item"
                    onClick={handleCloseMenu}
                  >
                    <Link to={`/categorys/${category.id}`}>{category.ten}</Link>
                    {category.tags.length > 0 && (
                      <div className="tag">
                        <ul className="sub-menu">
                          {category.tags.map((tag) => (
                            <li key={tag.id} onClick={handleCloseMenu}>
                              <Link to={`/tags/${tag.id}`} title={tag.ten}>
                                {tag.ten}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </nav>
        <div className={`all-list  ${isMenuOpen ? "show-menu" : ""}`}>
          <div className="container slide-menu">
            {category.map(
              (category) =>
                category.tags.length > 0 && (
                  <li
                    key={category.id}
                    className="nav-item"
                    onClick={handleCloseMenu}
                  >
                    <Link to={`/categorys/${category.id}`}>{category.ten}</Link>
                    {category.tags.length > 0 && (
                      <div className="tag">
                        <ul className="sub-menu">
                          {category.tags.map((tag) => (
                            <li key={tag.id} onClick={handleCloseMenu}>
                              <Link to={`/tags/${tag.id}`} title={tag.ten}>
                                {tag.ten}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
            )}
          </div>
        </div>
      </div>
      <div className="mobile container d-flex justify-content-between">
        <nav className="navbar navbar-expand-lg container">
          <ul className=" nav-mobi d-flex ">
            <div className="icon-actions">
              <li className="icon-home" onClick={handleCloseMenu}>
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="19"
                    viewBox="0 0 26 19"
                    fill="none"
                  >
                    <path
                      d="M13.0445 4.9291L5.04232 11.3699V18.3214C5.04232 18.5013 5.11548 18.674 5.24572 18.8012C5.37595 18.9285 5.55258 19 5.73676 19L10.6005 18.9877C10.7841 18.9868 10.9598 18.9149 11.0893 18.7877C11.2188 18.6606 11.2915 18.4885 11.2914 18.3091V14.2495C11.2914 14.0695 11.3646 13.8969 11.4948 13.7696C11.6251 13.6423 11.8017 13.5708 11.9859 13.5708H14.7637C14.9478 13.5708 15.1245 13.6423 15.2547 13.7696C15.385 13.8969 15.4581 14.0695 15.4581 14.2495V18.3061C15.4578 18.3954 15.4756 18.4839 15.5104 18.5664C15.5451 18.649 15.5962 18.7241 15.6607 18.7873C15.7253 18.8506 15.8019 18.9008 15.8863 18.935C15.9707 18.9692 16.0612 18.9869 16.1526 18.9869L21.0145 19C21.1987 19 21.3754 18.9285 21.5056 18.8012C21.6358 18.674 21.709 18.5013 21.709 18.3214V11.3652L13.7085 4.9291C13.6145 4.85501 13.4973 4.81461 13.3765 4.81461C13.2557 4.81461 13.1385 4.85501 13.0445 4.9291ZM25.6847 9.3068L22.0562 6.38395V0.508985C22.0562 0.373994 22.0013 0.244532 21.9037 0.149078C21.806 0.0536252 21.6735 0 21.5354 0H19.1048C18.9667 0 18.8342 0.0536252 18.7365 0.149078C18.6389 0.244532 18.584 0.373994 18.584 0.508985V3.58877L14.6981 0.464449C14.3252 0.164563 13.8573 0.000599477 13.3743 0.000599477C12.8914 0.000599477 12.4235 0.164563 12.0506 0.464449L1.06402 9.3068C1.01128 9.3494 0.967645 9.40173 0.93561 9.46082C0.903575 9.5199 0.883768 9.58458 0.877319 9.65115C0.87087 9.71772 0.877906 9.78487 0.898025 9.84878C0.918144 9.91269 0.950952 9.9721 0.994574 10.0236L2.10134 11.3385C2.14485 11.3902 2.19836 11.433 2.25881 11.4645C2.31926 11.4959 2.38547 11.5154 2.45364 11.5218C2.52181 11.5283 2.59061 11.5215 2.6561 11.5019C2.72159 11.4823 2.78248 11.4503 2.83529 11.4076L13.0445 3.19007C13.1385 3.11598 13.2557 3.07557 13.3765 3.07557C13.4973 3.07557 13.6145 3.11598 13.7085 3.19007L23.9182 11.4076C23.9709 11.4503 24.0317 11.4823 24.0971 11.502C24.1625 11.5216 24.2312 11.5285 24.2993 11.5222C24.3674 11.5159 24.4336 11.4966 24.4941 11.4653C24.5545 11.434 24.6081 11.3913 24.6517 11.3398L25.7585 10.0249C25.802 9.97308 25.8347 9.91336 25.8546 9.84917C25.8745 9.78498 25.8812 9.71759 25.8743 9.65086C25.8675 9.58412 25.8472 9.51938 25.8146 9.46033C25.7821 9.40129 25.7379 9.34911 25.6847 9.3068Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </li>
            </div>
            <div className={`menu ${isMenuOpen ? "show-menu" : ""}`}>
              {category.slice(0, 10).map((category) => (
                <li
                  key={category.id}
                  className="nav-item"
                  onClick={handleCloseMenu}
                >
                  <Link to={`/categorys/${category.id}`}>{category.ten}</Link>
                </li>
              ))}
            </div>
            <div className="icon-actions">
              <li className="click_on_off_menu" onClick={handleMenuToggle}>
                <Link to="#">
                  {isMenuOpen ? (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="19.0918"
                        y="22.0919"
                        width="27"
                        height="4"
                        transform="rotate(-135 19.0918 22.0919)"
                        fill="white"
                      />
                      <rect
                        x="0.0917969"
                        y="19.0919"
                        width="27"
                        height="4"
                        transform="rotate(-45 0.0917969 19.0919)"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="19"
                      viewBox="0 0 22 19"
                      fill="none"
                    >
                      <path
                        d="M0.78125 3.4898H21.0938C21.5252 3.4898 21.875 3.14261 21.875 2.71429V0.77551C21.875 0.347186 21.5252 0 21.0938 0H0.78125C0.349756 0 0 0.347186 0 0.77551V2.71429C0 3.14261 0.349756 3.4898 0.78125 3.4898ZM0.78125 11.2449H21.0938C21.5252 11.2449 21.875 10.8977 21.875 10.4694V8.53061C21.875 8.10229 21.5252 7.7551 21.0938 7.7551H0.78125C0.349756 7.7551 0 8.10229 0 8.53061V10.4694C0 10.8977 0.349756 11.2449 0.78125 11.2449ZM0.78125 19H21.0938C21.5252 19 21.875 18.6528 21.875 18.2245V16.2857C21.875 15.8574 21.5252 15.5102 21.0938 15.5102H0.78125C0.349756 15.5102 0 15.8574 0 16.2857V18.2245C0 18.6528 0.349756 19 0.78125 19Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </Link>
              </li>
            </div>
          </ul>
        </nav>
        <div className={`all-list  ${isMenuOpen ? "show-menu" : ""}`}>
          <div className="container search">
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
              <input
                className="form-control"
                placeholder="Tìm kiếm..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
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
          </div>
          <div className="container slide-menu">
            {category.map(
              (category) =>
                category.tags.length > 0 && (
                  <li
                    key={category.id}
                    className="nav-item"
                  >
                    <div className="d-flex justify-content-between">
                    <Link to={`/categorys/${category.id}`} onClick={handleCloseMenu}>{category.ten}</Link>
                    <div onClick={() => toggleTags(category.id)} style={{ cursor: 'pointer' }} className="arrow-icon"></div>
                    </div>
                    {category.tags.length > 0 && (
                      <div className="tag" style={{ display: openTags[category.id] ? 'block' : 'none' }}>
                        <ul className="sub-menu">
                          {category.tags.map((tag) => (
                            <li key={tag.id} onClick={handleCloseMenu}>
                              <Link to={`/tags/${tag.id}`} title={tag.ten}>
                                {tag.ten}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;










