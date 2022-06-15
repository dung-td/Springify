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
    <div className="grid">
      {/* Header */}
      <div className="d-flex justify-content-end align-items-center">
        <span class="material-icons">person</span>
        <p className="fw-bold mb-0">{t("admin")}</p>
        <p className="fw-bold mb-0 ms-2 me-2">|</p>
        <p className="fw-bold mb-0">{t("language")}</p>

        <div class="dropdown ms-2">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t("language")}
          </button>
          <ul class="dropdown-menu">
            <li>
              <p
                class="dropdown-item pointer"
                onClick={() => changeLanguage("vi")}
              >
                {t("languages.vi")}
              </p>
            </li>
            <li>
              <p
                class="dropdown-item pointer"
                onClick={() => changeLanguage("en")}
              >
                {t("languages.en")}
              </p>
            </li>
          </ul>
        </div>
      </div>

      {state == "list" && <ListSong callback={callback} />}
      {state == "add" && <AddSong callback={callback} />}
      {state == "play" && (
        <Player callback={callback} song={playingSong} mode={playerMode} />
      )}
    </div>
  )
}

export default App
