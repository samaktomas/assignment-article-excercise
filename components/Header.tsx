"use client";
import React from "react";
import { ArrowRightIcon, Bars3Icon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  //   const  session = await getServerSession();
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.split("/").pop() === path;
  };

  return (
    <header className=" bg-gray-50 sticky top-0 z-50 shadow-md px-10 py-2">
      <div className=" max-w-5xl mx-auto flex justify-between h-10 items-center">
        <Bars3Icon className="sm:hidden hover:text-gray-500 h-10 cursor-pointer" />

        <div className="hidden sm:flex h-10 cursor-pointer items-center space-x-6 ">
          <Link href="/" className="hover:text-gray-500">
            <HomeIcon className="h-8" />
          </Link>
          <Link
            href="/articles"
            className={`hover:text-gray-500 ${
              pathname === "/articles" && "text-blue-500"
            }`}
          >
            Recent Articles
          </Link>
          <Link
            href="/about"
            className={`hover:text-gray-500 ${
              pathname === "/about" && "text-blue-500"
            }`}
          >
            About
          </Link>
        </div>

        <div className="  cursor-pointer  ">
          <div className="flex justify-end items-center">
            {session?.user ? (
              <div className="flex space-x-6 items-center">
                <Link
                  className={`hover:text-gray-500 ${
                    pathname === "/admin/myarticles" && "text-blue-500"
                  }`}
                  href="/admin/myarticles"
                >
                  My Articles
                </Link>
                <Link
                  className={`hover:text-gray-500 first-letter:${
                    pathname === "/admin/articleform" && "text-blue-500"
                  }`}
                  href="/admin/articleform"
                >
                  Create Article
                </Link>
                <SignOutButton imageSrc={session?.user?.image!} />
              </div>
            ) : (
              <Link
                className="flex items-center text-blue-600 hover:opacity-60"
                href="/auth/signin"
              >
                Log In
                <ArrowRightIcon className="h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
