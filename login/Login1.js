import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isLogged } from "../utils/inStore";

export default function Login() {
  const setloged = useContext(isLogged).setLogged;
  const setUserType = useContext(isLogged).setUser;

  const [load, setLoad] = useState(false);
  const [user, setUser] = useState("student");
  const [mail, setMail] = useState();
  const [password, setPassword] = useState();

  const LoginHandeller = (e) => {
    e.preventDefault();
    setLoad(true);
    var formdata = new FormData();
    formdata.append("email", mail);
    formdata.append("password", password);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    if (user === "student") {
      fetch(
        "https://exam.dasta.store/api/auth/loginStudent",
        requestOptions
      ).then((result) => {
        if (result.status === 200) {
          result
            .json()
            .then((data) => {
              // console.log(data.user);
              const thisTime = new Date().getTime();
              Cookies.set("token", data.access_token, { expires: 6 / 24 });
              Cookies.set("user", "student", { expires: 6 / 24 });
              Cookies.set("email", data.user.email, { expires: 6 / 24 });
              Cookies.set("name", data.user.name, { expires: 6 / 24 });
              Cookies.set("expirein", thisTime + 3600 * 1000 * 6, {
                expires: 7 / 24,
              });
            })
            .then((data) => {
              setloged(true);
              setUserType("student");
              window.location.reload();
            });
        } else {
          setLoad(false);
          toast.error(" البريد الالكتروني او كلمة السر خطأ", {
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
      });
    } else if (user === "teacher") {
      fetch(
        "https://exam.dasta.store/api/auth/loginTeacher",
        requestOptions
      ).then((result) => {
        if (result.status === 200) {
          result
            .json()
            .then((data) => {
              // console.log(data.user);
              const thisTime = new Date().getTime();
              Cookies.set("token", data.access_token, { expires: 6 / 24 });
              Cookies.set("user", "teacher", { expires: 6 / 24 });
              Cookies.set("email", data.user.email, { expires: 6 / 24 });
              Cookies.set("name", data.user.name, { expires: 6 / 24 });
              Cookies.set("expirein", thisTime + 3600 * 1000 * 6, {
                expires: 7 / 24,
              });
            })
            .then((data) => {
              setloged(true);
              setUserType("teacher");
              window.location.reload();
            });
        } else {
          setLoad(false);
          toast.error(" البريد الالكتروني او كلمة السر خطأ", {
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
      });
    } else if (user === "admin") {
      fetch(
        "https://exam.dasta.store/api/auth/loginAdmin",
        requestOptions
      ).then((result) => {
        if (result.status === 200) {
          result
            .json()
            .then((data) => {
              // console.log(data.user);
              const thisTime = new Date().getTime();
              Cookies.set("token", data.access_token, { expires: 6 / 24 });
              Cookies.set("user", "admin", { expires: 6 / 24 });
              Cookies.set("email", data.user.email, { expires: 6 / 24 });
              Cookies.set("name", data.user.name, { expires: 6 / 24 });
              Cookies.set("expirein", thisTime + 3600 * 1000 * 6, {
                expires: 7 / 24,
              });
            })
            .then((data) => {
              setloged(true);
              setUserType("admin");
              window.location.reload();
            });
        } else {
          setLoad(false);
          toast.error(" البريد الالكتروني او كلمة السر خطأ", {
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
      });
    }
  };
  return (
    <div className=" flex items-center z-10 px-5 h-screen ">
      <div className=" p-2 absolute h-20 md:h-24 top-0 right-0">
        <img className=" h-full" src="/imgs/logo.jpeg" alt="logo" />
      </div>
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
      {load && (
        <div className=" w-full flex items-center justify-center fixed top-0 left-0 h-screen bg-black/10">
          <div className="loading"></div>
        </div>
      )}
      <div className=" md:w-4/5  lg:w-3/5  mx-auto overflow-hidden md:flex items-center  border shadow-2xl rounded-2xl">
        <div className="w-full md:w-1/2 p-4 h-full">
          <h1 className=" text-center text-lg my-1 md:text-2xl font-bold text-sky-900">
            مرحباً بعودتك
          </h1>
          <h4 className=" text-center my-1 text-sm md:text-lg font-bold text-sky-900">
            تسجيل الدخول
          </h4>

          <form>
            <select
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className=" w-full outline-none border-b text-center p-2 md:text-lg font-bold bg-white my-2"
            >
              <option value="student">طالب</option>
              <option value="teacher">مدرس</option>
              <option value="admin">ادارة</option>
            </select>

            <input
              required
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className=" focus:border-sky-900 transition-all duration-500 w-full outline-none border-b  p-2 md:text-lg font-bold bg-white my-2"
              type="text"
              placeholder="البريد الاكتروني"
            ></input>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" focus:border-sky-900 transition-all duration-500 w-full outline-none border-b  p-2 md:text-lg font-bold bg-white my-2"
              type="password"
              placeholder="كلمة السر"
            ></input>

            <div className=" flex items-center justify-center p-2">
              <button
                onClick={LoginHandeller}
                disabled={!user || !mail || !password}
                className=" text-center  bg-sky-900 transition-all ease-in-out duration-300 hover:bg-sky-950 text-white rounded-md py-1 px-4 outline-none mx-auto"
              >
                تسجيل دخول <i class="fa-solid fa-right-to-bracket"></i>
              </button>
            </div>
          </form>
        </div>
        <div className="  md:w-1/2">
          <img className="" src="/imgs/3.png" alt="login"></img>
        </div>
      </div>
    </div>
  );
}
