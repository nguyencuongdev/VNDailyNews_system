// src/services/api.js

const API_ENDPOINTS = {
  DABOARD_NEWS: process.env.REACT_APP_API_BASE_URL + '/dashboard-news',
  NEWS: process.env.REACT_APP_API_BASE_URL + '/news',
  CATEGORYS: process.env.REACT_APP_API_BASE_URL + '/categorys',
  TAGS: process.env.REACT_APP_API_BASE_URL + '/tags',
};


export default API_ENDPOINTS;
