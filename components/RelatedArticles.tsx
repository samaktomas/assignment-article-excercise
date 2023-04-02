"use client";
import React, { useEffect, useState } from "react";
import response from "../response.json";
import Link from "next/link";

export default function RelatedArticles() {
  const [randomArticles, setRandomArticles] = useState<Article[]>([]);

  useEffect(() => {
    const articles = response
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((article) => ({
        title: article.title,
        author: article.author,
        published_date: article.published_date.toString(),
        summary: article.summary,
        media: article.media || "/noimage.jpg",
        _id: article._id,
      }));
    setRandomArticles(articles);
  }, []);

  return (
    <div className="hidden lg:flex border-l border-slate-200 h-full mt-3 pb-10 w-1/3">
      <div className="ml-3">
        <h2 className="text-xl font-semibold whitespace-nowrap p-2">
          Related articles
        </h2>
        {randomArticles?.map((article) => (
          <Link
            key={article._id}
            href={{
              pathname: "articles/read",
              query: {
                title: article.title,
                author: article.author,
                published_date: article.published_date.toString(),
                summary: article.summary,
                media: article.media || "/noimage.jpg",
                _id: article._id,
              },
            }}
          >
            <div className="hover:shadow-sm p-2 rounded-md hover:opacity-70">
              <h2 className="font-semibold text-sm line-clamp-1">
                {article.title}
              </h2>
              <p className="line-clamp-3 text-xs my-1">{article.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
