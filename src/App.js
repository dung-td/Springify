import "./App.css"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import { ListSong } from "./pages/ListSong"
import { AddSong } from "./pages/AddSong"
import { Player } from "./pages/Player"

import { useTranslation } from "react-i18next"
import i18n from "./i18n"
import ModalLogin from "./components/ModalLogin"

function App() {
  const { t } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang, (err, t) => {
      localStorage.setItem("lang", lang)
      if (err) return console.log("something went wrong loading", err)
    })
  }

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("jwt") != null ? true : false
  )
  const [isOpenModal, setIsOpenModal] = useState(false)

  const logout = () => {
    localStorage.clear()
    setIsLogin(false)
    window.location.reload()
  }

  return (
    <div className="w-full grid grid-player md:max-w-md p-4">
      {/* Header */}
      <div className="inline-flex justify-end flex-row items-center">
        <span className="material-icons">person</span>
        {isLogin ? (
          <>
            <p className="font-bold">{t("admin")}</p>
            <div
              className="border border-gray-200 rounded-md p-1.5 md:px-4 md:py-2 pointer ml-4"
              onClick={() => logout()}
            >
              <span className="font-bold">{t("logout")}</span>
            </div>
          </>
        ) : (
          <>
            <div
              className="border border-gray-200 rounded-md p-2 md:px-4 md:py-2 pointer ml-4"
              onClick={() => setIsOpenModal(true)}
            >
              <span className="font-bold">{t("login")}</span>
            </div>
          </>
        )}
        <p className="font-bold ml-2 mr-2">|</p>

        <div className="dropdown ml-2">
          <select
            defaultValue={localStorage.getItem("lang")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              console.log(e.currentTarget.value)
              changeLanguage(e.currentTarget.value)
            }}
          >
            <option value="vi">{t("languages.vi")}</option>
            <option value="en">{t("languages.en")}</option>
          </select>
        </div>
      </div>

      <Routes>
        <Route path="/play/:id" element={<Player />} />
        <Route path="/edit/:id" element={<Player />} />
        <Route path="/play" element={<Player />} />
        <Route path="/" element={<ListSong />} />
        {isLogin ? (
          <>
            <Route path="/add" element={<AddSong />} />
          </>
        ) : null}
      </Routes>

      <span className="text-md text-center mt-4 mb-2">
        © 2022{" "}
        <a
          rel="noreferrer"
          target={"_blank"}
          className="text-bold underline"
          href="https://github.com/dung-td/Springify"
        >
          dungtd
        </a>
        . All Rights Reserved{" "}
      </span>

      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <Box sx={style}>
          <ModalLogin />
        </Box>
      </Modal>
    </div>
  )
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 400,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  p: 4,
}

export default App
