import React from "react";
import { useLocation } from "react-router-dom";

function UserPage() {
  const location = useLocation();
  const userInfor = location.state?.userInfor;

  if (!userInfor) {
    return <p>Thông tin người dùng không có.</p>;
  }

  return ( 
    <div className="container content">
      <p>{userInfor.tenhienthi}</p>
    </div>
  );
}

export default UserPage;
