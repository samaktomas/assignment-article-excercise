"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

export default function MyArticles() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);

  const router = useRouter();

  const handleEdit = (article: Article) => {
    const queryString = Object.entries(article)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const url = `/admin/articleform?${queryString}`;
    router.push(url);
  };

  const handelDelete = async (id: string) => {
    await deleteDoc(doc(db, "articles", id));
    alert("Article has been deleted");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "articles"),
        where("author", "==", session?.user?.name),
        orderBy("published_date", "desc")
      ),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          title: item.data().title,
          author: item.data().author,
          published_date: item.data().published_date,
          category: item.data().category,
          summary: item.data().summary,
          media: encodeURIComponent(item.data().media) || "",
          _id: item.id,
        }));
        setArticles(data);
      }
    );
    return unsubscribe;
  }, [db]);

  return (
    <div>
      {!articles ? (
        <p>Loading...</p>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="flex m-10 items-center">
            <h1 className="font-bold text-3xl ">My articles</h1>
            <Link
              href="/admin/articleform"
              className="bg-blue-500 text-white p-2 text-xs rounded-md hover:opacity-75 ml-10"
            >
              Create new article
            </Link>
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center font-bold">
                      <p className="whitespace-nowrap">Article title</p>
                      <ChevronUpDownIcon className="h-5 cursor-pointer hover:opacity-60" />
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center font-bold">
                      Perex
                      <ChevronUpDownIcon className="h-5 cursor-pointer hover:opacity-60" />
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center font-bold">
                      Author
                      <ChevronUpDownIcon className="h-5 cursor-pointer hover:opacity-60" />
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center font-bold">
                      <p className="whitespace-nowrap"># of comments</p>
                      <ChevronUpDownIcon className="h-5 cursor-pointer hover:opacity-60" />
                    </div>
                  </TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles?.map((article: any) => (
                  <TableRow
                    key={article._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <p>{article.title}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p className="line-clamp-1">{article.summary}</p>
                    </TableCell>
                    <TableCell align="center">
                      <p>{article.author}</p>
                    </TableCell>
                    <TableCell align="center">
                      {Math.floor(Math.random() * 10)}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex items-center space-x-4">
                        <PencilIcon
                          onClick={() => handleEdit(article)}
                          className="h-6 cursor-pointer hover:opacity-60 hover:text-blue-500"
                        />
                        <TrashIcon
                          onClick={() => handelDelete(article._id)}
                          className="h-6 cursor-pointer hover:opacity-60 hover:text-red-500"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
