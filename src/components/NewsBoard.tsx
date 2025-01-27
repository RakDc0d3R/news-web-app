import { useCallback, useEffect, useState } from "react";
import { fetchLatestArticles } from "../services/api";
import NewsItem from "./NewsItem";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export type NewsItemType = {
  title: string;
  description: string;
  urlToImage?: string;
  url: string;
  publishedDate?: string;
  category?: string;
  nextCursor?: string;
};

const NewsBoard = () => {
  const [articles, setArticles] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [nextPageId, setNextPageId] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const { category, fromDate, toDate, searchKeyword } = useSelector((state: RootState) => state.news);

  const fetchArticles = useCallback(async () => {
    console.log('hey')
    setLoading(true);
    try {
      const data = await fetchLatestArticles({
        category: category,
        fromDate: fromDate,
        toDate: toDate,
        searchKeyword: searchKeyword,
        skip: skip,
        page: page,
        nextPageId: nextPageId,
        pageSize: 10,
      });

      if (data.length < 10) {
        setHasMore(false);
      }

      setArticles((prevArticles) => [...prevArticles, ...data]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, [skip, nextPageId, page, category, fromDate, toDate, searchKeyword]);

  useEffect(() => {
    setArticles([]);
    setSkip(0);
    setPage(1)
    setNextPageId(undefined)
    setHasMore(true);
  }, [category, fromDate, toDate, searchKeyword]);

  useEffect(() => {
    if (hasMore) fetchArticles();
  }, [skip, nextPageId, page, fetchArticles]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setSkip((prevPage) => prevPage + 10);
        setPage((prevPage) => prevPage + 1);
        setNextPageId(articles[articles?.length - 1]?.nextCursor);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <div className="container">
      <div
        className="d-flex flex-column gap-4 position-relative"
        style={{ top: "80px" }}
      >
        <div>
          <h2>Latest News</h2>
        </div>
        <div>
          <div className="row gy-3">
            {articles?.map((news: any, index) => {
              return (
                <NewsItem
                  key={index}
                  news={{...news}}
                />
              );
            })}
          </div>
        </div>
        {loading && hasMore && (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        )}
        {!loading && articles.length === 0 && (
          <div className="d-flex justify-content-center my-4">
            <p>No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsBoard;
