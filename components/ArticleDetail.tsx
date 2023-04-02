import React from "react";
import Comments from "./Comments";
import RelatedArticles from "./RelatedArticles";

type Props = {
  article: Article;
};

export default function ArticleDetail({ article }: Props) {
  const { title, author, published_date, category, media, summary } = article;

  return (
    <div className="flex mt-5 p-5 sm:p-10 max-w-4xl 2xl:max-w-5xl mx-auto">
      <div className="flex w-2/3 mr-5">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">{title}</h1>
          <div className="flex space-x-3 py-4">
            <p className="text-xs text-gray-400">{author}</p>
            <span className="text-[10px] text-gray-400">●</span>
            <p className="text-xs text-gray-400">
              {published_date}
              {/* <TimeAgo date={published_date.toDate()} /> */}
            </p>
            <span className="text-[10px] text-gray-400">{`${
              category && "●"
            }`}</span>
            <p className="text-xs text-gray-400 ">{category}</p>
          </div>
          <div className="border border-slate-200 h-80 min-w-[300px]">
            <img
              src={media}
              alt="picture"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="my-6 cursor-default">{summary}</p>{" "}
          <Comments article={article} />
        </div>
      </div>

      {/* Right */}
      <RelatedArticles />
    </div>
  );
}
