import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";
import { getError } from "../utils/error";
//import { toast } from 'react-toastify'
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function Login() {
  const { data: session } = useSession();

  const router = useRouter();
  const isIn = Cookies.get("token") || false;
  const { redirect } = router.query;

  useEffect(() => {
    if (isIn) {
      router.push(redirect || "/");
      //router.push("/");
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState();

  // const submmitHndller = async ({ email, password }) => {
  //   try {
  //     const result = await signIn('credentials', {
  //       redirect: false,
  //       email,
  //       password
  //     })
  //     if (result.error) {
  //       logerr = (result.error)
  //     }

  //   } catch (err) {
  //     logerr = (getError(err))

  //   }

  // };

  const submmitHndller = async ({ email, password }) => {
    console.log("hi");
    try {
      await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4p1EGGjz0Hec4RK-PlTD9TGeZ5IslSAk",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      ).then((res) => {
        if (res.status === 200) {
          return res.json().then((data) => {
            router.push(redirect || "/");
            Cookies.set("token", data.idToken, { expires: 1 / 24 });
            Cookies.set("id", data.localId);
          });
        } else {
          setError("in vaild email or password");
        }
      });

      // if (response.status === 200) {
      //   Cookies.set("token", response.idToken);

      // }
    } catch (err) {
      setError(getError(err));
      //console.log(getError(err));
    }
  };
  return (
    <>
      <Layout title="login">
        <div>
          <form
            onSubmit={handleSubmit(submmitHndller)}
            className="mx-auto max-w-screen-md  block rounded-lg border border-gray-200 shadow-md p-5 mt-20 formcard"
          >
            <h1 className="mb-4 text-xl text-center">Log in</h1>
            <div className="mb-4">
              <label className="w-full" htmlfor="email">
                E-mail
              </label>
              <input
                {...register("email", {
                  required: "Please enter email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
                className="w-full"
                type="email"
                id="email"
                placeholder="enter your email"
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlfor="pssword">Password</label>
              <input
                {...register("password", {
                  required: "Please enter password",
                  minLength: {
                    value: 6,
                    message: "password is more than 5 chars",
                  },
                })}
                className="w-full"
                type="password"
                id="password"
                placeholder="enter your password"
              />
              {errors.password && (
                <div className="text-red-500 ">{errors.password.message}</div>
              )}
              {error && <div className="text-red-500 ">{error}</div>}
            </div>
            <div className="mb-4 primary-button-form-div">
              <button
                type="submmit"
                className="primary-button primary-button-form"
              >
                Login
              </button>
            </div>
            Don't have account{" "}
            <Link href="/signup">
              <span className="underline">register</span>
            </Link>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
