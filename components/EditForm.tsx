"use client";
import React, { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  params?: {
    id: string;
  };
};

type FormData = {
  title: string;
  author: string;
  summary: string;
  media: string;
  _id: string;
};

export default function EditForm({ params }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const publishArticle = async (data: FormData) => {
    const article = {
      author: session?.user?.email || "unknown",
      title: data.title,
      summary: data.summary,
      published_date: serverTimestamp(),
    };
    try {
      if (!id) {
        await addDoc(collection(db, "articles"), article);
      } else {
        await setDoc(doc(db, "articles", id), { article });
      }
    } catch (e) {
      console.error(e);
    }
    router.push("/admin/myarticles");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit(publishArticle)}>
        <div className="flex m-10 items-center">
          <h1 className="font-bold text-3xl ">
            {id === "new" ? "New" : "Edit"} article
          </h1>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 text-xs rounded-md hover:opacity-75 ml-10"
          >
            Publish article
          </button>
        </div>

        <section className=" flex flex-col space-y-6 m-10">
          <div>
            <p>Article Title</p>
            <input
              type="text"
              className="border border-stone-200 w-full h-10 rounded-md my-2 outline-none px-4"
              {...register("title", {
                required: true,
              })}
              name="title"
              placeholder="Type article title here..."
            />
          </div>

          <div>
            <p>Featured image</p>
            <img
              className="w-56 h-56 object-cover border border-stone-200 my-3"
              src={id === "new" ? "/noimage.jpg" : ""}
              alt="picture"
            />

            <div className="space-x-2 items-center">
              <button className="text-blue-500 hover:opacity-70">
                Upload new
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-red-500 hover:opacity-70">Delete</button>
            </div>
          </div>

          <div>
            <p>Content</p>

            <textarea
              className="border border-stone-200 w-full h-80 rounded-md my-2 outline-none p-4"
              cols={100}
              {...register("summary", {
                required: true,
              })}
              name="summary"
              placeholder="Type content here..."
            />
          </div>
        </section>
      </form>
    </div>
  );
}
