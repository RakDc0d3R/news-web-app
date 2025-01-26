import axios from "axios";
import { NewsItemType } from "../components/NewsBoard";
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
  //   const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
  //     params: {
  //       category: category,
  //       country: "us",
  //       apiKey: API_KEYS.newsAPI,
  //     },
  //   });
  // return response.data.articles;
  
//   const response = await axios.get(`https://api.worldnewsapi.com/search-news`, {
//     params: {
//       "source-country": "us",
//       "api-key": API_KEYS.theGuardian,
//       text: searchKeyword,
//       categories: category,
//       "earliest-publish-date": fromDate
//         ? dayjs(fromDate)?.format("YYYY-MM-DD")
//         : !fromDate && toDate
//         ? dayjs().subtract(29, "day")?.format("YYYY-MM-DD")
//         : undefined,
//       "latest-publish-date": toDate ? dayjs(toDate)?.format("YYYY-MM-DD") : undefined,
//       offset: skip,
//       number: pageSize
//     },
//   });
//   return response?.data?.news?.map((value: any) => {
//     return {
//       title: value?.title,
//       description: value?.text,
//       url: value?.url,
//       urlToImage: value?.image,
//       category: value?.category,
//       publishedDate: value?.publish_date ? dayjs(value?.publish_date).format('DD/MM/YYYY') : 'NA'
//     } as NewsItemType;
//   });
const response = await axios.get(`https://api.newsdatahub.com/v1/news`, {
    headers: {
'X-Api-Key': API_KEYS.newsDataHub,
    },
    params: {
      country: "us",      
      q: searchKeyword,
      topic: category,
      start_date: fromDate
        ? dayjs(fromDate)?.format("YYYY-MM-DD")
        : !fromDate && toDate
        ? dayjs().subtract(29, "day")?.format("YYYY-MM-DD")
        : undefined,
        end_date: toDate ? dayjs(toDate)?.format("YYYY-MM-DD") : undefined,
        cursor: nextPageId,
      per_page: pageSize
    },
  });
  return response?.data?.data?.map((value: any) => {
    return {
      title: value?.title,
      description: value?.description,
      url: value?.article_link,
      urlToImage: value?.media_url,
      category: value?.topic,
      publishedDate: value?.pub_date ? dayjs(value?.pub_date).format('DD/MM/YYYY') : 'NA',
      nextCursor: response?.data?.next_cursor
    } as NewsItemType;
  });
};
