import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isLogged } from "../utils/inStore";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const search = useLocation().search

  const redirect = new URLSearchParams(search).get('redirect')




  // console.log(router)

  const token = Cookies.get("token");
  const setloged = useContext(isLogged).setLogged;
  const logged = useContext(isLogged).logged
  useEffect(() => {
    if (logged) {
      navigate("/");
    }
  }, []);
  if (!!token) {
    navigate("/");
    return (
      <div className=" bg-gray-200 px-2 py-8 text-center ">
        <h1 className=" my-36 text-3xl font-bold">أنت بالفعل مسجل دخول</h1>
      </div>
    );
  }

  // if (!!token) return null;

  const submitHandeller = (e) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("phone", phone);
    formdata.append("password", password);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("https://fullexbackend.m2ksa.com/api/auth/login", requestOptions)
      .then((result) => {
        if (result.status === 200) {
          result
            .json()
            .then((data) => {
              // console.log(data.user);
              const thisTime = new Date().getTime();
              Cookies.set("token", data.access_token, { expires: 1 / 24 });
              Cookies.set("email", data.user.email, { expires: 1 / 24 });
              Cookies.set("phone", data.user.phone, { expires: 1 / 24 });
              Cookies.set("name", data.user.name, { expires: 1 / 24 });
              Cookies.set("expirein", thisTime + data.expire_in * 1000, {
                expires: 1 / 24,
              });
            })
            .then((data) => {
              setloged(true);

              if (!!redirect) {
                navigate(`/${redirect}`)
              } else {
                navigate("/")
              }
              ;
            });
        } else {
          setLoading(false);
          toast.error("رقم الهاتف او كلمة السر خطأ", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div className=" bg-gray-200 px-2 py-8 ">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="  flex items-center justify-center my-16">
        <hr className=" mt-3 h-[3px] border-[#f9c149] w-12 md:w-28 mx-2 rounded-r-full rounded-l-full bg-[#f9c149]" />
        <h4 className=" text-lg text-[#f9c149] md:text-2xl font-bold">
          تسجيل دخول
        </h4>
        <hr className=" mt-3 h-[3px] w-12 md:w-28 border-[#f9c149] mx-2 rounded-r-full rounded-l-full bg-[#f9c149]" />
      </div>
      <div className=" relative text-center w-full mx-auto my-20 p-8 md:w-8/12 rounded-xl bg-white shadow-2xl">
        {loading && (
          <div className=" bg-white/70 border h-full w-full absolute top-0 left-0 rounded-xl z-[5] flex items-center justify-center ">
            <div class="balls">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        <form onSubmit={submitHandeller}>
          <h1 className=" text-2xl font-sans font-bold text-[#125373] mb-12">
            مرحباً بعودتك
          </h1>
          <div className=" relative my-3">
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=" رقم الهاتف"
              className=" numberoftracking border-b p-2 w-full text-lg font-sans md:w-3/4 outline-none rl"
              type="text"
            ></input>
            <span className=" bor w-full md:w-3/4"></span>
          </div>
          <div className=" relative my-3">
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className=" numberoftracking border-b p-2 w-full text-lg font-sans md:w-3/4 outline-none rl"
              type="password"
            ></input>
            <span className=" bor w-full md:w-3/4"></span>
          </div>
          <div className="  md:w-3/4 mx-auto flex items-center justify-end py-3">
            <Link to="/signup">
              <p
                // disabled={!numTacking}
                className=" disabled:opacity-80 mr-4  hover:text-white py-1 rounded-[5px] px-6 transition-all ease-in-out duration-700   hover:bg-[#125373] bg-black/0 text-[#125373] border border-[#125373] "
              >
                إنشاء حساب
              </p>{" "}
            </Link>
            <button
              type="submit"
              disabled={!password || !phone}
              className=" disabled:opacity-80 disabled:bg-[#125373] disabled:text-white  text-white py-1 rounded-[5px] px-6 transition-all ease-in-out duration-700   bg-[#125373] hover:bg-black/0 hover:text-[#125373] border-2 border-[#125373] "
            >
              تسجيل دخول
            </button>
          </div>
        </form>
        <hr className="w-full md:w-3/4 mx-auto my-8"></hr>
        <div className=" my-4  flex justify-center  text-center text-base">
          <a
            className=" border text-black hover:text-[#125373] h-8 w-8 pt-1 rounded-full mx-2"
            href="https://instagram.com/fullex_official?igshid=MzRlODBiNWFlZA=="
          >
            {" "}
            <i className="fa-brands fa-instagram"></i>{" "}
          </a>
          <a
            className=" border text-black hover:text-[#125373] h-8 w-8 pt-1 rounded-full mx-2"
            href="https://www.snapchat.com/add/fullexofficial?share_id=6orewkRhKNg&locale=ar-AE"
          >
            {" "}
            <i className="fa-brands fa-snapchat"></i>{" "}
          </a>
          <a
            className=" border text-black hover:text-[#125373] h-8 w-8 pt-1 rounded-full mx-2"
            href="https://www.tiktok.com/@fullex_official?_t=8g1OZN2cAP0&_r=1"
          >
            {" "}
            <i className="fa-brands fa-tiktok"></i>{" "}
          </a>
          <a
            className=" border text-black hover:text-[#125373] h-8 w-8 pt-1 rounded-full mx-2"
            href="https://x.com/FULLexOfficial?t=U0wTukBFDfwDsdq7FdcfYA&s=09"
          >
            {" "}
            <i className="fa-brands fa-twitter"></i>{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
