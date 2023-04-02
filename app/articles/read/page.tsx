import React from "react";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/ArticleDetail";

type Props = {
  searchParams?: Article;
};

export default function ReadArticle({ searchParams }: Props) {
  if (!searchParams) return notFound();

  const article = searchParams;

  return <ArticleDetail article={article} />;
}
