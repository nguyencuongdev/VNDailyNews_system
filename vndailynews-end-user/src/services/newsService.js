import axios from "axios";
import API_ENDPOINTS from "@config/api";

// call api trang chủ
export const fetchDashboardNews = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.DABOARD_NEWS}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(" Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};
// call api menu
export const fetchCategory = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CATEGORYS}`);
    return response.data.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};
// call api trang chi tiết danh mục
export const fetchCategoryPage = async (id, page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CATEGORYS}/${id}/?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(" Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};

// call api trang chi tiết bài đăng
export const fetchArticleById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.NEWS}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};
// Hàm cập nhật lượt xem bài viết
export const updateViewCount = async (id) => {
  const viewedArticles =
    JSON.parse(localStorage.getItem("viewedArticles")) || [];

  if (!viewedArticles.includes(id)) {
    try {
      await axios.put(`${API_ENDPOINTS.NEWS}/${id}`);
      viewedArticles.push(id);
      // localStorage.setItem("viewedArticles", JSON.stringify(viewedArticles));
    } catch (error) {
      console.error("Đã xảy ra lỗi khi cập nhật số lượng lượt xem", error);
      throw error;
    }
  }
};

// call api trang chi tiết thể loại trong danh mục
export const fetchTagData = async (id, page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.TAGS}/${id}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tag data:", error);
    throw error;
  }
};

// call api danh sách tin tức mới nhất
export const fetchLatestNews = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.NEWS}/new?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(" Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};

// call api danh sách tin tức đề xuất
export const fetchRecommendedNews = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.NEWS}/propose?limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error(" Có lỗi xảy ra khi gọi API:", error);
    throw error;
  }
};
