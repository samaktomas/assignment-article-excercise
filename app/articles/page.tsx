"use client";
import ArticleRow from "@/components/ArticleRow";
import { useState, useEffect } from "react";
import { getArticles } from "@/utils/database";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles(true, 20).then((data) => setArticles(data));
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-bold text-3xl m-10">Recent articles</h1>
      {articles?.map((article) => (
        <ArticleRow key={article._id} article={article} />
      ))}
    </div>
  );
}
