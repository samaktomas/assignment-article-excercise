import { db } from "@/firebase";
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";
import response from "../response.json";

const BASE_URL =
  "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=50";
// !!!!API Limited reqests 50/day!!!!

const getAllArticlesDb = (sorted: boolean, maxLimit: number) => {
  if (!sorted) return query(collection(db, "articles"), limit(maxLimit));
  return query(
    collection(db, "articles"),
    orderBy("published_date", "desc"),
    limit(maxLimit)
  );
};

export const getArticles = async (sorted: boolean, maxLimit?: number) => {
  //   const res = await fetch(BASE_URL, {
  //     headers: {
  //       "x-api-key": process.env.NEXT_PUBLIC_API_KEY + "",
  //     },
  //   });
  //   const { articles } = await res.json();
  //   return articles;
  maxLimit = maxLimit || 50;

  const q = getAllArticlesDb(sorted, maxLimit);

  const dummyData = response.map((article) => ({
    title: article.title,
    author: article.author,
    published_date: new Date(article.published_date).toDateString(),
    category: article.topic,
    summary: article.summary,
    media: article.media || "/noimage.jpg",
    _id: article._id,
  }));

  const allArticles = getDocs(q).then((snapshot) => {
    const data = snapshot.docs.map((item) => ({
      title: item.data().title,
      author: item.data().author,
      published_date: new Date(
        item.data().published_date.seconds * 1000 +
          item.data().published_date.nanoseconds / 1000000
      ).toDateString(),
      category: item.data().category,
      summary: item.data().summary,
      media: item.data().media || "/noimage.jpg",
      _id: item.id,
    }));
    return [...data, ...dummyData].slice(0, maxLimit);
  });
  return allArticles;
};
