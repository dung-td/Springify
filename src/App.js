import { useState, ReactDOM } from "react"
import "./App.css"
import { ListSong } from "./pages/ListSong"
import { AddSong } from "./pages/AddSong"
import { Player } from "./pages/Player"

import { useTranslation } from "react-i18next"
import i18n from "./i18n"

function App() {
  const [state, setState] = useState("list")
  const [playerMode, setPlayerMode] = useState("play")
  const [playingSong, setPlayingSong] = useState("")
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en")

  const { t } = useTranslation()

  const callback = (action, songId) => {
    console.log(songId)
    switch (action) {
      case "play":
      default:
        setPlayingSong(songId)
        setPlayerMode("play")
        setState("play")
        break
      case "edit":
        setPlayerMode("edit")
        setPlayingSong(songId)
        setState("play")
        break
      case "goback":
        setState("list")
        break
      case "add":
        setState("add")
        break
    }
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang, (err, t) => {
      localStorage.setItem("lang", lang)
      if (err) return console.log("something went wrong loading", err)
      t("key")
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
            value={lang}
            onChange={(e) => {
              changeLanguage(e.currentTarget.value)
            }}
          >
            <option selected={lang === "vi" ? true : false} value="vi">
              <p class="dropdown-item pointer">{t("languages.vi")}</p>
            </option>
            <option selected={lang === "en" ? true : false} value="en">
              <p class="dropdown-item pointer">{t("languages.en")}</p>
            </option>
          </select>
        </div>
      </div>

      {state === "list" && <ListSong callback={callback} />}
      {state === "add" && <AddSong callback={callback} />}
      {state === "play" && (
        <Player callback={callback} song={playingSong} mode={playerMode} />
      )}
    </div>
  )
}

export default App
