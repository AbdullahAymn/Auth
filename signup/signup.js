import React, { useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import Link from "next/link";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

function Signup() {
  const isIn = Cookies.get("token");
  if (isIn) {
    return (
      <Layout>
        <h1 className="mb-4 text-xl">You already have an account</h1>
        <Link href="/">
          <button type="submmit" className="primary-button ">
            Home Page
          </button>
        </Link>
      </Layout>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const submmitHndller = async () => {
    setLoading(true);
    const userData = {
      email: getValues("email"),
      password: getValues("password"),
      returnSecureToken: true,
    };
    const respone = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4p1EGGjz0Hec4RK-PlTD9TGeZ5IslSAk",
      {
        method: "POST",
        body: JSON.stringify(userData),
      }
    ).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => {
          router.push("/");
          Cookies.set("token", data.idToken, { expires: 1 / 24 });
          Cookies.set("id", data.localId);
        });
      } else if (res.status === 400) {
        setLoading(false);
        setError("email is already exist");
      } else {
        setLoading(false);
        setError("error has happened");
      }
    });
  };

  return (
    <>
      <Layout title="login">
        <form
          onSubmit={handleSubmit(submmitHndller)}
          className="mx-auto max-w-screen-md  block rounded-lg border border-gray-200 shadow-md p-5 mt-7 formcard"
        >
          <h1 className="mb-4 text-xl">Sign Up</h1>
          <div className="mb-4">
            <label htmlfor="name"> name</label>
            <input
              {...register("name", {
                required: "please enter your name",
              })}
              className="w-full"
              type="text"
              id="name"
              placeholder="enter your name"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlfor="email">e-mail</label>
            <input
              {...register("email", {
                required: "please enter your email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "please enter vaild email",
                },
              })}
              className="w-full"
              type="email"
              id="email"
              placeholder="enter your email"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlfor="pssword">password</label>
            <input
              {...register("password", {
                required: "please enter password",
                minLength: {
                  value: 6,
                  message: "password must be more than 5 chars",
                },
              })}
              className="w-full"
              type="password"
              id="password"
              placeholder="enter your password"
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlfor="repssword">repeate password</label>
            <input
              {...register("repassword", {
                required: "re-enter your password",
                validate: (value) => value === getValues("password"),

                minLength: {
                  value: 6,
                  message: "password must be more than 5 chars",
                },
              })}
              className="w-full"
              type="password"
              id="repassword"
              placeholder="repeate your password"
            />
            {errors.repassword && (
              <p className="text-red-600">{errors.repassword.message}</p>
            )}
            {getValues("repassword") !== getValues("password") && (
              <p className="text-red-600">passwords is not the same</p>
            )}
          </div>
          <div className="mb-4 primary-button-form-div">
            {error && <p className="text-red-600">{error}</p>}
            <button
              disabled={loading}
              type="submmit"
              className="primary-button "
            >
              {loading ? "loading..." : "Sign Up"}
            </button>
          </div>
          alredy have account{" "}
          <Link href="/login">
            <span className="underline">login</span>
          </Link>
        </form>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(Signup), { ssr: false });
