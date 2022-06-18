import { useState, ReactDOM, useEffect } from "react"
import { Routes, Route, Link } from "react-router-dom"
import "./App.css"
import { ListSong } from "./pages/ListSong"
import { AddSong } from "./pages/AddSong"
import { Player } from "./pages/Player"

import { useTranslation } from "react-i18next"
import i18n from "./i18n"

function App() {
  const { t } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang, (err, t) => {
      localStorage.setItem("lang", lang)
      if (err) return console.log("something went wrong loading", err)
    })
  }

  return (
    <div className="w-full grid p-4">
      {/* Header */}
      <div className="inline-flex justify-end flex-row items-center">
        <span class="material-icons">person</span>
        <p className="font-bold">{t("admin")}</p>
        <p className="font-bold ml-2 mr-2">|</p>
        <p className="font-bold">{t("language")}</p>

        <div class="dropdown ml-2">
          <select
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              console.log(e.currentTarget.value)
              changeLanguage(e.currentTarget.value)
            }}
          >
            <option value="vi">
              <p class="dropdown-item pointer">{t("languages.vi")}</p>
            </option>
            <option value="en">
              <p class="dropdown-item pointer">{t("languages.en")}</p>
            </option>
          </select>
        </div>
      </div>

      <Routes>
        <Route path="/play/:id" element={<Player />} />
        <Route path="/" element={<ListSong />} />
        <Route path="/add" element={<AddSong />} />
      </Routes>
    </div>
  )
}

export default App
