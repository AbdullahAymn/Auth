import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { inActions } from "../../utils/ReStore";
import Cookies from "js-cookie";

export default function Signup() {
  const loggedIn = useSelector((state) => state.loggedin);
  const router = useRouter();
  const dispatch = useDispatch();

  if (loggedIn) {
    const router = useRouter();
    router.push("/");

    return;
  }

  const [load, setLoad] = useState(false);
  const [error, setError] = useState();

  const submitHandeller = async () => {
    setLoad(true);
    setError("");
    const data = {
      email: getValues("email"),
      password: getValues("password"),
      displayName: getValues("username"),

      returnSecureToken: true,
    };
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDpzYNXJoqkHySt4y8y5G5jAgi36lB63Wg",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then((res) => {
      if (res.status === 200) {
        return res.json().then(async (data) => {
          Cookies.set("token", data.idToken, { expires: 1 / 24 });
          Cookies.set("id", data.localId, { expires: 1 / 24 });
          await router.push("/");
          dispatch(inActions.login())
          setLoad(false);
        });
      } else if (res.status === 400) {
        setLoad(false);
        setError("email is already exist");
      } else {
        setLoad(false);
        setError("error has happened");
      }
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  return (
    <>
      <form
        disabled={load}
        onSubmit={handleSubmit(submitHandeller)}
        className="w-fit mx-auto shadow-lg p-8 flex flex-col items-start rounded-xl disabled:opacity-50"
      >
        <h1 className=" text-2xl mb-2 text-center w-fit mx-auto text-twitter">
          Create an Account
        </h1>

        {/* <label htmlFor="image">Profile image</label>
        <input
          {...register("image")}
          className="w-fit text-xs p-2 m-2"
          type="file"
        /> */}

        <label htmlFor="email">Email</label>
        <input
          {...register("email", {
            required: "Please enter vaild email",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
              message: "Please enter valid email",
            },
          })}
          className=" w-80 text-lg my-1 p-2 outline-none bg-white border-b rounded-lg transition-all duration-300 focus:ring-2 ring-twitter opacity-50"
          placeholder="enter email"
          type="email"
          id="email"
        />
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        <label htmlFor="username">user name</label>
        <input
          {...register("username", {
            required: "Please enter user name",
          })}
          className=" w-80 text-lg my-1 p-2 outline-none bg-white border-b rounded-lg transition-all duration-300 focus:ring-2 ring-twitter opacity-50"
          placeholder="enter user name"
          type="text"
          id="username"
        />
        {errors.username && (
          <div className="text-red-500">{errors.username.message}</div>
        )}
        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "Please enter vaild password",
            minLength: {
              value: 6,
              message: "password is more than 5 chars",
            },
          })}
          className=" w-80 text-lg my-1 p-2 outline-none bg-white border-b rounded-lg transition-all duration-300 focus:ring-2 ring-twitter opacity-50"
          placeholder="enter password"
          type="password"
          id="password"
        ></input>
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <label htmlFor="repassword">password again</label>
        <input
          {...register("repassword", {
            required: "Please enter password again",
            validate: (value) => value === getValues("password"),
            minLength: {
              value: 6,
              message: "password is more than 5 chars",
            },
          })}
          className=" w-80 text-lg my-1 p-2 outline-none bg-white border-b rounded-lg transition-all duration-300 focus:ring-2 ring-twitter opacity-50"
          placeholder="enter password again"
          type="password"
          id="repassword"
        ></input>
        {errors.repassword && (
          <div className="text-red-500">{errors.repassword.message}</div>
        )}
        {getValues("password") !== getValues("repassword") && (
          <div className="text-red-500">passwords is not the same </div>
        )}
        <button
          disabled={load}
          className=" text-center bg-twitter cursor-pointer py-2 px-4 rounded-full text-gray-100 text-lg font-sans mx-auto my-2 disabled:opacity-50"
          type="submmit"
        >
          {load ? "loading ..." : "Sign Up"}
        </button>
        {error && (
          <div className="text-red-500 opacity-70 text-center w-full my-2">
            {error}
          </div>
        )}
        <p className="text-sm text-cyan-800">
          Already have an account{" "}
          <Link className="underline" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
