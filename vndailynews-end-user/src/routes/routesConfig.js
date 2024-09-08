// src/routes/routesConfig.js
import Home from "@pages/Home/Home";
import Category from "@pages/Category/Category";
import Search from "@pages/Search/Search";
import NewsDetailPage from "@pages/NewsDetail/NewsDetailPage";
import TagPage from "@pages/Tag/TagPage";
import LatestNews from "@pages/LatestNews/LatestNews";
import RecommendedNews from "@pages/RecommenedNews/RecommenedNews";
import NotFoundPage from "@pages/NotFoundPage/NotFoundPage";
import UserPage from "@pages/User/UserPage";

const routesConfig = [
  { path: "/", element: <Home /> },
  { path: "/categorys/:id", element: <Category /> },
  { path: "/tags/:id", element: <TagPage /> },
  { path: "/newsdetail/:id", element: <NewsDetailPage /> },
  { path: "/search", element: <Search /> },
  { path: "/latestnews", element: <LatestNews /> },
  { path: "/recommendednews", element: <RecommendedNews /> },
  { path: "/user", element: <UserPage /> },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <NotFoundPage /> },
];

export default routesConfig;
