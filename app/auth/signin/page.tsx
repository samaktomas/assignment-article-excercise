"use client";
import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [userError, setUserError] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const handleSignin = async (data: FormData) => {
    const { email, password } = data;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.ok) router.push("/");
    else {
      setUserError(true);
      alert("Login failed");
    }
  };

  // Google Handler function
  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000" });
  }

  // Github Login
  async function handleGithubSignin() {
    signIn("github", { callbackUrl: "http://localhost:3000" });
  }

  return (
    <div className="m-auto rounded-md w-3/4 max-w-xl h-3/4 text-center my-10 shadow-md">
      <section className="w-3/4 mx-auto flex flex-col gap-10  pb-3">
        <div className="title">
          <h1 className="text-gray-800 text-3xl font-bold py-4">Log In</h1>
        </div>

        <form
          onSubmit={handleSubmit(handleSignin)}
          className="flex flex-col gap-5"
        >
          <div
            className={`input_group ${
              (errors.email || userError) && "border border-rose-600"
            }`}
          >
            <input
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
                maxLength: 20,
              })}
              type="email"
              name="email"
              placeholder="Email"
              className="input_text"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm text-left" role="alert">
              Correct email is required
            </p>
          )}

          <div
            className={`input_group ${
              (errors.password || userError) && "border border-rose-600"
            }`}
          >
            <input
              {...register("password", { required: true, maxLength: 20 })}
              type={`${passwordShown ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              className="input_text"
            />
            <span className="icon flex items-center px-4 bg-slate-50 rounded-md">
              <EyeIcon
                onClick={togglePasswordVisiblity}
                className="h-4 cursor-pointer hover:opacity-75 "
              />
            </span>
          </div>
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-sm text-left" role="alert">
              Password is required
            </p>
          )}

          <div className="input-button">
            <button disabled={isSubmitting} type="submit" className="button">
              Login
            </button>
          </div>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-300">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="input-button">
            <button
              onClick={handleGoogleSignin}
              type="button"
              className="button_custom"
            >
              Sign In with Google{" "}
              <Image src={"/google.svg"} width="20" height={20} alt="" />
            </button>
          </div>
          <div className="input-button">
            <button
              onClick={handleGithubSignin}
              type="button"
              className="button_custom"
            >
              Sign In with Github{" "}
              <Image src={"/github.svg"} width={25} height={25} alt="" />
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            href={"/auth/register"}
            className="text-blue-700 hover:text-blue-500"
          >
            Sign Up{" "}
          </Link>
        </p>
      </section>
    </div>
  );
}
