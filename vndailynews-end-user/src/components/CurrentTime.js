// src/CurrentDate.js

import React, { useState, useEffect } from 'react';

function CurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const day = daysOfWeek[currentDate.getDay()];
  const date = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = currentDate.getFullYear();

  return (
      <p className='m-0'> {day}, ngày {date}/{month}/{year}</p>
  );
}

export default CurrentDate;
