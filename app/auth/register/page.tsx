"use client";
import React, { useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type FormData = {
  username: string;
  email: string;
  password: string;
  cpassword: string;
};

export default function page() {
  const [userError, setUserError] = useState(false);

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

  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const registerUser = async (data: FormData) => {
    const { username, email, password } = data;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        updateProfile(userAuth.user, {
          displayName: username,
        }).then(async () => {
          console.log("user created: ");
          signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
          });
        });
      })
      .catch((e) => {
        setUserError(true);
        alert(e.message);
      });
  };

  return (
    <div className="m-auto rounded-md w-3/4 max-w-xl h-3/4 text-center my-10 shadow-md ">
      <section className="w-3/4 mx-auto flex flex-col gap-10  pb-3">
        <div className="title">
          <h1 className="text-gray-800 text-3xl font-bold py-4">Register</h1>
        </div>

        <form
          onSubmit={handleSubmit(registerUser)}
          className="flex flex-col gap-5"
        >
          <div
            className={`input_group ${
              (errors.username || userError) && "border border-rose-600"
            }`}
          >
            <input
              {...register("username", { required: true, maxLength: 20 })}
              type="text"
              name="username"
              placeholder="Username"
              className="input_text"
            />
          </div>
          {errors.username?.type === "required" && (
            <p className="text-red-500 text-sm text-left" role="alert">
              Username is required
            </p>
          )}
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
              type={`${passwordShown ? "text" : "password"}`}
              {...register("password", {
                required: true,
                minLength: 6,
                maxLength: 20,
              })}
              name="password"
              placeholder="Password"
              className="input_text border border-rose-600"
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

          <div
            className={`input_group ${
              (errors.cpassword || userError) && "border border-rose-600"
            }`}
          >
            <input
              type={`${confirmPasswordShown ? "text" : "password"}`}
              {...register("cpassword", {
                validate: (value) => value === watch("password"),
              })}
              name="cpassword"
              placeholder="Confirm Password"
              className="input_text"
            />
            <span className="icon flex items-center px-4 bg-slate-50 rounded-md">
              <EyeIcon
                onClick={toggleConfirmPasswordVisiblity}
                className="h-4 cursor-pointer hover:opacity-75 "
              />
            </span>
          </div>
          {errors.cpassword && (
            <p className="text-red-500 text-sm text-left" role="alert">
              Passwords do NOT match
            </p>
          )}

          <div className="input-button">
            <button disabled={isSubmitting} type="submit" className="button">
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 ">
          Have an account?{" "}
          <Link
            href={"/auth/signin"}
            className="text-blue-700 hover:text-blue-500"
          >
            Sign In{" "}
          </Link>
        </p>
      </section>
    </div>
  );
}
