import Link from "next/link";
import { useForm } from "react-hook-form";
import { inActions } from "../../utils/ReStore";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function SinIn() {
  const [error, setserror] = useState();
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;
  
  
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandeller = async () => {
    setLoad(true);
    setserror("");
    const inputs = {
      email: getValues("email"),
      password: getValues("password"),
      returnSecureToken: true,
    };
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDpzYNXJoqkHySt4y8y5G5jAgi36lB63Wg",
      {
        method: "POST",
        body: JSON.stringify(inputs),
      }
    ).then((res) => {
      if (res.status === 200) {
        return res.json().then(async (data) => {
          Cookies.set("token", data.idToken, { expires: 1 / 24 });
          Cookies.set("id", data.localId, { expires: 1 / 24 });

          
          await router.push(redirect || "/");
          dispatch(inActions.login());

          setLoad(false);
        });
      } else if (res.status === 400) {
        setserror("email or passwrd is incorrect");
        setLoad(false);
      }
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submitHandeller)}
        className="w-fit mx-auto shadow-lg p-8 flex flex-col items-start rounded-xl"
      >
        <h1 className=" text-2xl mb-2 text-center w-fit mx-auto text-twitter">
          Log in
        </h1>
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

        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: "Please enter vaild password ",

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
        <button
          disabled={load}
          className=" disabled:opacity-50 text-center bg-twitter cursor-pointer py-2 px-4 rounded-full text-gray-100 text-lg font-sans mx-auto my-2 "
          type="submmit"
        >
          {load ? "loading..." : "Log in"}
        </button>
        {error && (
          <div className=" text-sm text-red-500 text-center w-fit mx-auto my-2">
            email or password is incorrect
          </div>
        )}
        <p className="text-sm text-cyan-800">
          Don't have account{" "}
          <Link className="underline" href="/signup">
            Register
          </Link>
        </p>
      </form>
    </>
  );
}
