"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import {
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type Props = {
  article: Article;
};

export default function Comments({ article }: Props) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any>([]);

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "articles", article._id, "comments"),
        orderBy("published_date", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db]);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const commentTosSend = comment;
    setComment("");

    addDoc(collection(db, "articles", article._id, "comments"), {
      author: session?.user?.name,
      avatar: session?.user?.image,
      published_date: serverTimestamp(),
      comment: commentTosSend,
    });
  };

  return (
    <div className="pt-5 border-t border-slate-200 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>

        {session?.user && (
          <div className="flex my-4">
            <img
              className="relative h-8 px-1 rounded-full mr-3"
              src={session?.user?.image || ""}
              alt=""
            />
            <form className="w-full">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Join the discussion"
                className="border border-slate-200 w-full rounded-md px-3 outline-none py-1"
              />
              <button hidden type="submit" onClick={(e) => handleSubmit(e)}>
                Send
              </button>
            </form>
          </div>
        )}

        <div className="my-8">
          {comments?.length > 0 ? (
            comments.map((comment: any) => (
              <div key={comment.id} className="flex my-5">
                <img
                  className="relative h-7 w-auto px-1 rounded-full mr-3"
                  src={comment.data().avatar || "/avatar.png"}
                  alt=""
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center">
                    <div className="text-sm font-semibold">
                      {comment.data().author}
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      <p>
                        <TimeAgo
                          date={comment.data().published_date?.toDate()}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="text-sm my-2">{comment.data().comment}</div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-xs">+12</div>
                    <ChevronUpIcon className="h-3 cursor-pointer hover:opacity-70" />
                    <ChevronDownIcon className="h-3 cursor-pointer hover:opacity-70" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2>No comments yet</h2>
          )}
        </div>

        {/* UserComments */}
      </div>
    </div>
  );
}
