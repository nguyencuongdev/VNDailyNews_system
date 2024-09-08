import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { fetchArticleById, updateViewCount } from "../../services/newsService";
import ArticleDetail from "@components/NewsDetailPage/ArticleDetail/ArticleDeatil";
import SimilarNews from "@components/NewsDetailPage/SimilarNews/SimilarNews";
import LatestNewsList from "@components/LatestNewsList/LatestNewsList";
import RecommenNewsList from "@components/CategoryPage/RecommenNewsList/RecommenNewsList";
import ShareButton from "@components/NewsDetailPage/ShareButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Spinner from "react-bootstrap/Spinner";

const NewsDetailPage = () => {
  const { id } = useParams(); // lấy ID từ url khi người dùng ấn vào bài viết
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  const updateViewCountCallback = useCallback(() => {
    updateViewCount(id);
  }, [id]);

  useEffect(() => {
    setArticle(null);
    const fetchArticle = async () => {
      try {
        const data = await fetchArticleById(id);
        if (data) {
          setArticle(data);
          updateViewCountCallback();
        } else {
          navigate("*");
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 403)
        ) {
          navigate("/404");
        } else {
          console.error("Đã xảy ra lỗi khi tìm dữ liệu bài viết", error);
        }
      }
    };

    fetchArticle();
  }, [id, updateViewCountCallback, navigate]);

  useDocumentTitle(
    article
      ? `${article.inforNews.tiede} - Hệ thống tin tức 24h`
      : "Đang tải..."
  );

  if (!article)
    return (
      <div className="container content">
        <div className="loading-spinner">
          <Spinner animation="border" />
        </div>
      </div>
    );
  const { inforNews, tags, newsSimilarList } = article;
  const articleUrl = `${window.location.origin}/news/${id}`;

  return (
    <div className="news-detail-page container content">
      <Row>
        <Col lg={9}>
          <ArticleDetail inforNews={inforNews} tags={tags} />
          <div className="share-news">
            <ShareButton url={articleUrl} title={inforNews.title} />
          </div>
          <SimilarNews newsSimilarList={newsSimilarList} />
        </Col>
        <Col lg={3} md={12} className="content-right">
          <Row>
            <Col lg={12} className="mb-3">
              <LatestNewsList />
            </Col>
            <Col lg={12}>
              <RecommenNewsList />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default NewsDetailPage;
