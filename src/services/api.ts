import axios from "axios";
import dayjs from "dayjs";
import qs from "qs";

const API_KEYS = {
  newsAPI: "0087d62d3fd84a68bbefef311796672f",
  theGuardian: "574e0f6b67de4d33a01af061d84b5747",
  newsDataHub: "Tel81Dc-5KWtCW-SH9lyjaUC5fXBsdnahpiPDcq3sOI",
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

  if (
    !source ||
    source.split(",").includes("news api") ||
    source.split(",").includes("all sources")
  ) {
    const categories = category?.split(",").map((item) => item.trim());
    const categoriesQuery = categories?.map((value) => {
      return " OR " + value;
    });
    apiCalls.push(
      axios
        .get(`https://newsapi.org/v2/everything`, {
          params: {
            q: searchKeyword
              ? searchKeyword + `${category ? categoriesQuery : ""}`
              : "latest" + `${category ? categoriesQuery : ""}`,
            from: formattedFromDate,
            to: formattedToDate,
            apiKey: API_KEYS.newsAPI,
            page: page,
            pageSize: pageSize,
            domains: "techcrunch.com,thenextweb.com",
          },
        })
        .catch(() => undefined)
    );
  } else {
    apiCalls.push(Promise.resolve(undefined));
  }

  if (
    !source ||
    source.split(",").includes("the guardian") ||
    source.split(",").includes("all sources")
  ) {
    apiCalls.push(
      axios
        .get(`https://api.worldnewsapi.com/search-news`, {
          params: {
            "source-country": "us",
            "api-key": API_KEYS.theGuardian,
            text: searchKeyword,
            categories: "health,entertainment,",
            "earliest-publish-date": formattedFromDate,
            "latest-publish-date": formattedToDate,
            offset: skip,
            number: pageSize,
          },
        })
        .catch(() => undefined)
    );
  } else {
    apiCalls.push(Promise.resolve(undefined));
  }

  if (
    !source ||
    source.split(",").includes("news data hub") ||
    source.split(",").includes("all sources")
  ) {
    const categories = category?.split(",").map((item) => item.trim());

    apiCalls.push(
      axios
        .get(`https://api.newsdatahub.com/v1/news`, {
          headers: {
            "X-Api-Key": API_KEYS.newsDataHub,
          },
          params: {
            country: "us",
            q: searchKeyword,
            topic: categories,
            start_date: formattedFromDate,
            end_date: formattedToDate,
            cursor: nextPageId,
            per_page: pageSize,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .catch(() => undefined)
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
            nextCursor:
              responses[2]?.status === "fulfilled"
                ? responses[2]?.value?.data?.next_cursor
                : undefined,
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
