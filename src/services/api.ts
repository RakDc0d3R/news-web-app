import axios from "axios";
import dayjs from "dayjs";

const API_KEYS = {
  newsAPI: "b5e5c18dc9d54dfb811cd21782ef39b6",
  theGuardian: "14777193373741259005f072a8c6db4e",
  newsDataHub: "vBK6-EHLdXd5KxQ6Lc_gyW5Wvt2O1Hglsu6iKwXdDpQ",
};

export const fetchLatestArticles = async (filters: {
  category?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
  skip?: number;
  page?: number;
  pageSize?: number;
  nextPageId?: string;
}) => {
  const {
    category,
    source,
    fromDate,
    toDate,
    searchKeyword,
    skip,
    page,
    pageSize,
    nextPageId,
  } = filters;

  const formattedFromDate = fromDate
    ? dayjs(fromDate)?.format("YYYY-MM-DD")
    : !fromDate && toDate
    ? dayjs().subtract(29, "day")?.format("YYYY-MM-DD")
    : undefined;

  const formattedToDate = toDate
    ? dayjs(toDate)?.format("YYYY-MM-DD")
    : undefined;

  const apiCalls: Promise<any>[] = [];

  if (!source || source === "news api" || source === "all sources") {
    apiCalls.push(
      axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: searchKeyword + `${category ? "+" + category : ""}`,
          from: formattedFromDate,
          to: formattedToDate,
          apiKey: API_KEYS.newsAPI,
          page: page,
          pageSize: pageSize,
        },
      }).catch(() => undefined)
    );
  } else {
    apiCalls.push(Promise.resolve(undefined));
  }

  if (!source || source === "the guardian" || source === "all sources") {
    apiCalls.push(
      axios.get(`https://api.worldnewsapi.com/search-news`, {
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
      }).catch(() => undefined)
    );
  } else {
    apiCalls.push(Promise.resolve(undefined));
  }

  if (!source || source === "news data hub" || source === "all sources") {
    apiCalls.push(
      axios.get(`https://api.newsdatahub.com/v1/news`, {
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
      }).catch(() => undefined)
    );
  } else {
    apiCalls.push(Promise.resolve(undefined));
  }

  try {
    const responses = await Promise.allSettled(apiCalls);

    const newsAPIArticles =
      responses[0]?.status === "fulfilled" && responses[0].value?.data?.articles
        ? responses[0]?.value?.data?.articles?.map((value: any) => ({
            title: value?.title,
            description: value?.description,
            url: value?.url,
            urlToImage: value?.urlToImage,
            category: value?.category,
            publishedDate: value?.publishedAt
              ? dayjs(value?.publishedAt).format("DD/MM/YYYY")
              : "NA",
          }))
        : [];
    
    const theGuardianArticles =
      responses[1]?.status === "fulfilled" && responses[1].value?.data?.news
        ? responses[1]?.value?.data?.news?.map((value: any) => ({
            title: value?.title,
            description: value?.text,
            url: value?.url,
            urlToImage: value?.image,
            category: value?.category,
            publishedDate: value?.publish_date
              ? dayjs(value?.publish_date).format("DD/MM/YYYY")
              : "NA",
          }))
        : [];

    const newsDataHubArticles =
      responses[2]?.status === "fulfilled" && responses[2].value?.data?.data
        ? responses[2]?.value?.data?.data?.map((value: any) => ({
            title: value?.title,
            description: value?.description,
            url: value?.article_link,
            urlToImage: value?.media_url,
            category: value?.topic,
            publishedDate: value?.pub_date
              ? dayjs(value?.pub_date).format("DD/MM/YYYY")
              : "NA",
            nextCursor: responses[2]?.status === "fulfilled" ? responses[2]?.value?.data?.next_cursor : undefined,
          }))
        : [];

    const combinedArticles = [
      ...newsAPIArticles,
      ...theGuardianArticles,
      ...newsDataHubArticles,
    ];

    return combinedArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to fetch articles from one or more sources");
  }
};
