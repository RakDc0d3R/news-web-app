import axios from "axios";
import dayjs from "dayjs";

const API_KEYS = {
  newsAPI: import.meta.env.VITE_NEWS_API_API_KEY,
  theGuardian: import.meta.env.VITE_THE_GUARDIAN_API_KEY,
  newsDataHub: import.meta.env.VITE_NEWS_DATA_HUB_API_KEY,
};

export const fetchLatestArticles = async (filters: {
  category?: string;
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
  skip?: number;
  page?: number;
  pageSize?: number;
  nextPageId?: string;
}) => {
  const { category, fromDate, toDate, searchKeyword, skip, page, pageSize, nextPageId } = filters;

  const formattedFromDate = fromDate
    ? dayjs(fromDate)?.format("YYYY-MM-DD")
    : !fromDate && toDate
    ? dayjs().subtract(29, "day")?.format("YYYY-MM-DD")
    : undefined;

  const formattedToDate = toDate ? dayjs(toDate)?.format("YYYY-MM-DD") : undefined;

  const newsAPICall = axios.get(`https://newsapi.org/v2/everything`, {
    params: {
      q: searchKeyword + `${category ? "+" + category : ""}`,
      from: formattedFromDate,
      to: formattedToDate,
      apiKey: API_KEYS.newsAPI,
      page: page,
      pageSize: pageSize,
    },
  });

  const theGuardianCall = axios.get(`https://api.worldnewsapi.com/search-news`, {
    params: {
      "source-country": "us",
      "api-key": API_KEYS.theGuardian,
      text: searchKeyword,
      categories: category,
      "earliest-publish-date": formattedFromDate,
      "latest-publish-date": formattedToDate,
      offset: skip,
      number: pageSize,
    },
  });

  const newsDataHubCall = axios.get(`https://api.newsdatahub.com/v1/news`, {
    headers: {
      "X-Api-Key": API_KEYS.newsDataHub,
    },
    params: {
      country: "us",
      q: searchKeyword,
      topic: category,
      start_date: formattedFromDate,
      end_date: formattedToDate,
      cursor: nextPageId,
      per_page: pageSize,
    },
  });

  try {
    const [newsAPIResponse, theGuardianResponse, newsDataHubResponse] = await Promise.all([
      newsAPICall,
      theGuardianCall,
      newsDataHubCall,
    ]);

    const newsAPIArticles = newsAPIResponse?.data?.articles?.map((value: any) => ({
      title: value?.title,
      description: value?.description,
      url: value?.url,
      urlToImage: value?.urlToImage,
      category: value?.category,
      publishedDate: value?.publishedAt ? dayjs(value?.publishedAt).format("DD/MM/YYYY") : "NA",
    })) || [];

    const theGuardianArticles = theGuardianResponse?.data?.news?.map((value: any) => ({
      title: value?.title,
      description: value?.text,
      url: value?.url,
      urlToImage: value?.image,
      category: value?.category,
      publishedDate: value?.publish_date ? dayjs(value?.publish_date).format("DD/MM/YYYY") : "NA",
    })) || [];

    const newsDataHubArticles = newsDataHubResponse?.data?.data?.map((value: any) => ({
      title: value?.title,
      description: value?.description,
      url: value?.article_link,
      urlToImage: value?.media_url,
      category: value?.topic,
      publishedDate: value?.pub_date ? dayjs(value?.pub_date).format("DD/MM/YYYY") : "NA",
      nextCursor: newsDataHubResponse?.data?.next_cursor,
    })) || [];

    const combinedArticles = [...newsAPIArticles, ...theGuardianArticles, ...newsDataHubArticles];
    return combinedArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles from one or more sources");
  }
};
