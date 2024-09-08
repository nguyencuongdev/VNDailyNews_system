import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuAccount.scss";

function MenuAccount(props) {
  const { userInfor } = props;

  const navigate = useNavigate();

  const handleUserPageNavigation = (e) => {
    e.preventDefault(); 
    if (userInfor) {
      navigate('/user', { state: { userInfor } });
    }
  };

  return (
    <div className="dropdown menu-account">
      <button
        className="btn dropdown-toggle btn-menu-account d-flex align-items-center"
        type="button"
        data-toggle="dropdown"
        aria-expanded="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="main-grid-item-icon mr-2"
          fill="none"
          stroke="currentColor"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Chào, {userInfor.tenhienthi}
      </button>
      <div className="dropdown-menu dropdown-menu-account dropdown-menu-right">
        <a
          className="dropdown-item dropdown-menu-account-item"
          href="/user"
          onClick={handleUserPageNavigation}
        >
          Thông tin người dùng
        </a>
        <a
          className="dropdown-item dropdown-menu-account-item"
          href={`${process.env.REACT_APP_BACKEND_URL}/news`}
        >
          Chuyển đến trang quản lý
        </a>
        <a
          className="dropdown-item dropdown-menu-account-item"
          href={`${process.env.REACT_APP_BACKEND_URL}/logout`}
        >
          Đăng xuất
        </a>
      </div>
    </div>
  );
}

export default MenuAccount;
