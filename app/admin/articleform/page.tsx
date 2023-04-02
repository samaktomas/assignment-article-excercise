"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-hot-toast";

type FormData = {
  title: string;
  author: string;
  summary: string;
  category: string;
  media: string;
  _id: string;
};

type Props = {
  searchParams: Article;
};

export default function ArticleForm({ searchParams }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [imageUpload, setImageUpload] = useState("");
  const [imageBlob, setImageBlob] = useState(null);

  const article: Article = searchParams || {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (article) {
      setValue("title", article.title);
      setValue("summary", article.summary);
      setValue("category", article.category || "");
      setImageUpload(article.media || "/noimage.jpg");
    }
  }, [article]);

  const publishArticle = async (data: FormData) => {
    if (isSubmitting) return;
    let articleId = article._id;
    const notification = toast.loading("Publishing the article...");
    try {
      if (!articleId) {
        const newArticleRef = doc(collection(db, "articles"));
        articleId = newArticleRef.id;
      }
      setDoc(doc(db, "articles", articleId), {
        title: data.title,
        author: session?.user?.name,
        published_date: serverTimestamp(),
        category: data.category || "general",
        summary: data.summary,
      });
      const imageRef = ref(storage, `images/${articleId}`);
      if (imageBlob)
        await uploadBytesResumable(imageRef, imageBlob).then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "articles", articleId), {
            media: downloadURL,
          });
        });
    } catch (e) {
      console.error(e);
      toast.error("Uuups, somethig got wrong...");
    }
    toast.success("Article published!", {
      id: notification,
    });
    router.push("/admin/myarticles");
  };

  const handleImageUpload = (e: any) => {
    const path = e?.target?.files[0];
    if (!path) return;
    e.target.value = null;
    setImageBlob(path);
    setImageUpload(URL.createObjectURL(path));
  };

  const deleteImage = () => {
    setImageBlob(null);
    setImageUpload("");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit(publishArticle)}>
        <div className="flex m-10 items-center">
          <h1 className="font-bold text-3xl ">
            {!article ? "New" : "Edit"} article
          </h1>
          <button
            disabled={isSubmitting}
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
            <p>Category</p>
            <input
              type="text"
              className="border border-stone-200 w-full h-10 rounded-md my-2 outline-none px-4"
              {...register("category", {
                required: false,
              })}
              name="category"
              placeholder="Type category here..."
            />
          </div>

          <div>
            <p>Featured image</p>
            <img
              className="w-56 h-56 object-contain border border-stone-200 my-3"
              src={imageUpload || "/noimage.jpg"}
              alt="picture"
            />

            <div className="space-x-2 items-center flex">
              <input
                type="file"
                accept="image/*"
                hidden
                id="upload"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="upload"
                className="text-blue-500 hover:opacity-70 cursor-pointer"
              >
                {imageUpload === "/noimage.jpg"
                  ? "Upload an Image"
                  : "Upload new"}
              </label>
              {imageUpload !== "/noimage.jpg" && (
                <div>
                  <span className="text-gray-300">{"| "}</span>
                  <button
                    id="deleteImg"
                    onClick={deleteImage}
                    className="text-red-500 hover:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              )}
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
