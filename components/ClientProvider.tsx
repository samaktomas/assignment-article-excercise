"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function ClientProvider() {
  return (
    <div>
      <Toaster position="top-center" />
    </div>
  );
}
