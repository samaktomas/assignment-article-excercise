"use client";
import RelatedArticles from "@/components/RelatedArticles";
import { getArticles } from "@/utils/database";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles(false, 5).then((data) => setArticles(data));
  }, []);

  return (
    <div className="flex mt-5 p-5 sm:p-10 max-w-4xl 2xl:max-w-5xl mx-auto">
      <Carousel className="w-full p-5 cursor-pointer hover:bg-gray-50 rounded-lg">
        {articles.map((article) => (
          <Link
            key={article._id}
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
            className="flex w-full"
          >
            <div>
              <div className="border border-slate-200 h-80 min-w-[300px]">
                <img
                  src={article.media}
                  alt="picture"
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="font-bold text-3xl line-clamp-1 py-1">
                {article.title}
              </h1>
              <div className="flex space-x-3">
                <p className="text-xs text-gray-400">{article.author}</p>
                <span className="text-[10px] text-gray-400">●</span>
                <p className="text-xs text-gray-400">
                  {article.published_date}
                  {/* <TimeAgo date={published_date.toDate()} /> */}
                </p>
                <span className="text-[10px] text-gray-400">{`${
                  article.category && "●"
                }`}</span>
                <p className="text-xs text-gray-400 ">{article.category}</p>
              </div>

              <p className="my-3 line-clamp-3 text-sm">{article.summary}</p>
            </div>
          </Link>
        ))}
      </Carousel>

      <RelatedArticles />
    </div>
  );
}
