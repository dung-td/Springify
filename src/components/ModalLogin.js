import React, { useState } from "react"

import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import i18n from "../i18n"
import { server } from "../interfaces/server"

const ModalLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { t } = useTranslation()

  const login = () => {
    fetch(`${server}/login`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log(data)
          localStorage.setItem("jwt", data.object.token)
          window.location.reload()
        } else {
          Swal.fire(t("fail", "", "error"))
        }
      })
  }

  return (
    <div className="justify-center items-center flex-row overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      {/*header*/}
      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
        <h3 className="w-full text-center text-2xl font-semibold ">
          {t("login")}
        </h3>
      </div>
      {/*body*/}
      <div className="relative p-6">
        <div className="space-y-4">
          <div className="relative flex w-full flex-wrap items-stretch md-3">
            <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-600 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-Width="2"
              >
                <path
                  stroke-Linecap="round"
                  stroke-Linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <input
              className="px-3 py-3 placeholder-slate-400 text-slate-600 relative bg-white rounded text-sm border border-inherit outline-none focus:outline-none w-full pl-10 hover:border-black focus:border-cyan-700"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.currentTarget.value)
              }}
            ></input>
          </div>
          <span className="z-10 h-full leading-snug font-normal absolute text-center text-slate-600 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-Width="2"
            >
              <path
                stroke-Linecap="round"
                stroke-Linejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <input
            type="password"
            value={password}
            className="px-3 py-3 placeholder-slate-400 text-slate-600 relative bg-white rounded text-sm border border-inherit outline-none focus:outline-none w-full pl-10 hover:border-black focus:border-cyan-700"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.currentTarget.value)
            }}
          ></input>
          <button
            disabled={isLoading}
            className={`${
              isLoading ? "" : "hover:bg-red-500"
            }inline-flex items-center justify-center w-full h-12 rounded-xl bg-red-700 text-white`}
            onClick={() => {
              login()
            }}
          >
            {t("login")}
            {isLoading ? (
              <svg
                role="status"
                className="ml-4 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalLogin
