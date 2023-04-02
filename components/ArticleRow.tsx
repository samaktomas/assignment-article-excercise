import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer, query } from "firebase/firestore";
import { db } from "@/firebase";

type Props = {
  article: Article;
};

export default function ArticleRow({ article }: Props) {
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const counts = async () => {
      const q = query(collection(db, "articles", article._id, "comments"));
      const snapshot = await getCountFromServer(q);
      setCommentsCount(snapshot.data().count);
    };
    counts();
  }, [db]);

  return (
    <div className="flex m-10 p-5 max-w-3xl hover:shadow-md rounded-md">
      <img
        className="hidden sm:flex h-60 w-60 object-cover "
        src={article.media}
        alt="Picture"
      />

      <div className="flex flex-col mx-5">
        <h2 className="line-clamp-1 font-bold text-xl">{article.title}</h2>

        <div className="flex space-x-3 py-4">
          <p className="text-xs text-gray-400">{article.author}</p>
          <span className="text-[10px] text-gray-400">●</span>
          <p className="text-xs text-gray-400">{article.published_date}</p>
        </div>

        <p className="line-clamp-4 text-sm cursor-default">{article.summary}</p>

        <div className="flex py-4 space-x-5 items-center flex-1">
          <Link
            href={{
              pathname: "articles/read",
              query: {
                title: article.title,
                author: article.author,
                published_date: article.published_date.toString(),
                category: article.category,
                summary: article.summary,
                media: article.media || "/noimage.jpg",
                _id: article._id,
              },
            }}
            className="text-sm text-blue-400 font-semibold hover:opacity-60"
          >
            Read whole article
          </Link>
          <p className="text-xs text-gray-400">{`${commentsCount} comments`}</p>
        </div>
      </div>
    </div>
  );
}
