import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { server } from "../interfaces/server"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Swal from "sweetalert2"

export const AddSong = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingNewAuthor, setIsAddingNewAuthor] = useState(false)
  const [isAddingNewGenre, setIsAddingNewGenre] = useState(false)
  const [songName, setSongName] = useState("")
  const [songAuthor, setSongAuthor] = useState("")
  const [songGenre, setSongGenre] = useState("")
  const [songSrc, setSongSrc] = useState()
  const [songThumbnail, setSongThumbnail] = useState()
  const [genreList, setGenreList] = useState([])
  const [authorList, setAuthorList] = useState([])

  // Get Genre data
  useEffect(() => {
    fetch(`${server}/genre/all`)
      .then((res) => res.json())
      .then((data) => {
        setGenreList(data.object)
      })
  }, [isAddingNewGenre])

  // Get Author data
  useEffect(() => {
    fetch(`${server}/author/all`)
      .then((res) => res.json())
      .then((data) => {
        setAuthorList(data.object)
      })
  }, [isAddingNewAuthor])

  const add = () => {
    console.log(songThumbnail)
    if (songName == "") {
      Swal.fire("Error", "Missing name field!", "warning")
    } else if (songAuthor == "") {
      Swal.fire("Error", "Missing author field!", "warning")
    } else if (songGenre == "") {
      Swal.fire("Error", "Missing genre field!", "warning")
    } else if (songSrc == null) {
      Swal.fire("Error", "Missing source field!", "warning")
    } else if (!songSrc.type.includes("audio")) {
      Swal.fire("Error!", "Source file type not supported!", "error")
    } else if (songThumbnail != null) {
      if (!songThumbnail.type.includes("image")) {
        Swal.fire("Error!", "Thumbnail file type not supported!", "error")
        return
      }
    } else if (isAddingNewAuthor || isAddingNewGenre) {
      Swal.fire(
        "Error",
        "Editing author and genre, plese save it first!",
        "warning"
      )
    } else {
      // addSong()
    }
  }

  const addSong = () => {
    setIsLoading(true)
    let songData = new FormData()
    songData.append("src", songSrc)
    songData.append("name", songName)
    songData.append("author", songAuthor)
    songData.append("genre", songGenre)
    songData.append("thumbnail", songThumbnail)

    fetch(`${server}/music/upload`, {
      method: "POST",
      body: songData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        if (data.status === "ok") {
          Swal.fire("Thành công!", "Bài hát đã được thêm!", "success").then(
            () => {
              window.location.href = "/"
            }
          )
        } else {
          Swal.fire("Thất bại!", "Đã xảy ra lỗi, vui lòng thử lại", "error")
        }
      })
  }

  const addAuthor = () => {
    if (songAuthor == "") {
      Swal.fire("Error", "Missing field author!", "warning")
    } else {
      setIsLoading(true)
      fetch(`${server}/author/add`, {
        method: "POST",
        body: JSON.stringify({
          name: songAuthor,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          if (data.status == "OK") {
            setSongAuthor(data.object.id)
            setIsAddingNewAuthor(false)
          } else {
            Swal.fire(
              "Error",
              "Aleary have author with name:" + songAuthor,
              "error"
            )
          }
        })
    }
  }

  const addGenre = () => {
    if (songGenre == "") {
      Swal.fire("Error", "Missing field author!", "warning")
    } else {
      setIsLoading(true)
      fetch(`${server}/genre/add`, {
        method: "POST",
        body: JSON.stringify({
          name: songGenre,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          if (data.status == "OK") {
            setSongGenre(data.object.id)
            setIsAddingNewGenre(false)
          } else {
            Swal.fire(
              "Error",
              "Aleary have genre with name:" + songGenre,
              "error"
            )
          }
        })
    }
  }

  return (
    <div className="border border-gray-300 rounded-md p-4 mt-4">
      <p className="font-bold">{t("actions.add") + " " + t("song")}</p>

      <div className="border-b border-gray-300"></div>

      <div>
        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.name")}:</p>
          <input
            className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
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
          {isAddingNewAuthor ? (
            <>
              <input
                className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                type="text"
                defaultValue={""}
                onChange={(e) => {
                  e.preventDefault()
                  setSongAuthor(e.currentTarget.value)
                }}
              />
              <div
                className="pointer rounded-md border border-gray-200 p-1 mb-2 mr-4 w-1/4 mt-2"
                onClick={() => addAuthor()}
              >
                <p className="text-center">{t("actions.add")}</p>
              </div>
            </>
          ) : (
            <select
              value={songAuthor}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => {
                console.log(e.currentTarget.value)
                setSongAuthor(e.currentTarget.value)
              }}
            >
              <option key={""} value={""}>
                {t("song_detail.author")}
              </option>
              {authorList.map((author) => {
                return (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                )
              })}
            </select>
          )}

          <p
            className="mb-0 me-2 p-2 text-sm italic hover:underline hover:cursor-pointer"
            onClick={() => setIsAddingNewAuthor(!isAddingNewAuthor)}
          >
            {!isAddingNewAuthor ? t(`addNewAuthor`) : t(`useExistAuthor`)}
          </p>
        </div>

        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.genre")}:</p>
          {isAddingNewGenre ? (
            <>
              <input
                className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                type="text"
                defaultValue={""}
                onChange={(e) => {
                  e.preventDefault()
                  setSongGenre(e.currentTarget.value)
                }}
              />
              <div
                className="pointer rounded-md border border-gray-200 p-1 mb-2 mr-4 w-1/4 mt-2"
                onClick={() => addGenre()}
              >
                <p className="text-center">{t("actions.add")}</p>
              </div>
            </>
          ) : (
            <select
              value={songGenre}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => {
                console.log(e.currentTarget.value)
                setSongGenre(e.currentTarget.value)
              }}
            >
              <option key={""} value={""}>
                {t("song_detail.genre")}
              </option>
              {genreList.map((genre) => {
                return (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                )
              })}
            </select>
          )}

          <p
            className="mb-0 me-2 p-2 text-sm italic hover:underline hover:cursor-pointer"
            onClick={() => setIsAddingNewGenre(!isAddingNewGenre)}
          >
            {!isAddingNewGenre ? t(`addNewGenre`) : t(`useExistGenre`)}
          </p>
        </div>

        <div className="mt-2">
          <p className="mb-0 me-2">{t("song_detail.src")}:</p>
          <input
            multiple={false}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const files = Array.from(e.target.files)
              if (files.length > 0) {
                setSongSrc(files[0])
              } else {
                setSongSrc(null)
              }
            }}
          ></input>
        </div>

        <div className="mt-2">
          <p className="mb-0 me-2">Thumbnail:</p>
          <input
            multiple={false}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files)
              if (files.length > 0) {
                console.log(files[0])
                setSongThumbnail(files[0])
              } else {
                setSongThumbnail(null)
              }
            }}
          ></input>
        </div>

        <div className="flex justify-end items-center mt-2">
          <div
            className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
            onClick={() => (window.location.href = "/")}
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        className="flex flex-col"
      >
        <p>{t("loading")}</p>
        <CircularProgress className="mt-4" color="inherit" />
      </Backdrop>
    </div>
  )
}
