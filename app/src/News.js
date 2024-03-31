import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import "./News.css";


const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const NEWS_API_KEY = "e522c74a61004e8f84c05b0c1bbd7c15";
      console.log(NEWS_API_KEY);
      const pageSize = 10;
      const keywords = ["finance", "economy", "stocks"];
      const keywordQuery = keywords.join("+");
      const url = `https://newsapi.org/v2/everything?q=${keywordQuery}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 news-container">
      <h2 className="text-center text-dark mb-4">
        Latest{" "}
        <span className="badge bg-danger text-dark">News</span>
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {articles.map((news, index) => (
            <div key={index} className="col">
              <NewsCard
                title={news.title}
                description={news.description}
                src={news.urlToImage}
                url={news.url}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default News;