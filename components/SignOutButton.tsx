"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

type Props = {
  imageSrc: string;
};

export default function SignOutButton({ imageSrc }: Props) {
  return (
    <div className="flex items-center">
      <ChevronDownIcon className="h-2 px-1 hover:text-gray-500" />
      <img
        onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
        src={imageSrc}
        alt="signout"
        className="h-10 rounded-full hover:opacity-70 "
      />
    </div>
  );
}
