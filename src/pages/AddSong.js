import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { server } from "../interfaces/server"
import Swal from "sweetalert2"

export const AddSong = (props) => {
  const { t } = useTranslation()
  const [songName, setSongName] = useState("")
  const [songAuthor, setSongAuthor] = useState("")
  const [songGenre, setSongGenre] = useState("")
  const [songSrc, setSongSrc] = useState()

  const back = () => {
    props.callback("goback", "")
  }

  const add = () => {
    let songData = new FormData()
    songData.append("src", songSrc)
    songData.append("name", songName)
    songData.append("author", songAuthor)
    songData.append("genre", songGenre)
    fetch(`${server}/music/upload`, {
      method: "POST",
      body: songData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          Swal.fire("Thành công!", "Bài hát đã được thêm!", "success").then(
            () => {
              back()
            }
          )
        } else {
          Swal.fire("Thất bại!", "Đã xảy ra lỗi, vui lòng thử lại", "error")
        }
      })
  }

  return (
    <div className="border border-gray-300 rounded-md p-4 mt-4">
      <p className="font-bold">{t("actions.add") + " " + t("song")}</p>

      <div className="border-b border-gray-300"></div>

      <div>
        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.name")}:</p>
          <input
            class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
            type="text"
            defaultValue={songName}
            onChange={(e) => {
              e.preventDefault()
              setSongName(e.currentTarget.value)
            }}
          />
        </div>

        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.author")}:</p>
          <input
            class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
            type="text"
            defaultValue={songAuthor}
            onChange={(e) => {
              e.preventDefault()
              setSongAuthor(e.currentTarget.value)
            }}
          />
        </div>

        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.genre")}:</p>
          <input
            class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
            type="text"
            defaultValue={songGenre}
            onChange={(e) => {
              e.preventDefault()
              setSongGenre(e.currentTarget.value)
            }}
          />
        </div>

        <div className="mt-2">
          <p className="mb-0 me-2">{t("song_detail.src")}:</p>
          <input
            multiple={false}
            type="file"
            accept=".mp3"
            onChange={(e) => {
              const files = Array.from(e.target.files)
              setSongSrc(files[0])
              console.log("files:", files)
            }}
          ></input>
        </div>

        <div className="flex justify-end items-center mt-2">
          <div
            className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
            onClick={() => back()}
          >
            <p className="text-center">{t("actions.back")}</p>
          </div>
          <div
            className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
            onClick={() => add()}
          >
            <p className="text-center">{t("actions.add")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
