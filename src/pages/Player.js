import React, { useRef, useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import moment from "moment"
import { useTranslation } from "react-i18next"

import { Slider } from "../components/Slider"
import { server } from "../interfaces/server"
import Swal from "sweetalert2"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Snackbar from "@mui/material/Snackbar"
import Tooltip from "@mui/material/Tooltip"

export const Player = () => {
  let { id } = useParams()

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("jwt") != null ? true : false
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [songCount, setSongCount] = useState(0)
  const [song, setSong] = useState()
  const [nextSong, setNextSong] = useState()
  const [previousSong, setPreviousSong] = useState()
  const [repeat, setRepeat] = useState(
    localStorage.getItem("repeat") === "true" ? true : false
  )
  const [shuffle, setShuffle] = useState(
    localStorage.getItem("shuffle") === "true" ? true : false
  )
  const [shuffleSongs, setShuffleSongs] = useState([])
  const [playedSong, setPlayedSong] = useState([])
  const [songName, setSongName] = useState()
  const [songAuthor, setSongAuthor] = useState()
  const [songGenre, setSongGenre] = useState()
  const [updateAt, setUpdateAt] = useState()
  const [genreList, setGenreList] = useState([])
  const [authorList, setAuthorList] = useState([])
  const songRef = useRef()
  const { t } = useTranslation()

  useEffect(() => {
    let p = Math.round((currentTime / duration) * 100)
    setPercentage(p)

    if (p >= 100) {
      next()
    }
  }, [currentTime])

  // Get music data
  useEffect(() => {
    setIsLoading(true)
    if (id !== undefined) {
      localStorage.setItem("playing", id)

      fetch(`${server}/music/get?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          if (data.status === "ok") {
            console.log(data.object)
            document.title = data.object.name
            setSong(data.object)
            setSongName(data.object.name)
            setSongAuthor(data.object.author.id)
            setSongGenre(data.object.genre.id)
            setUpdateAt(data.object.updateAt)
          } else {
            Swal.fire("Ooops!", "Something went wrong :(", "info").then(() => {
              window.location.href = "/"
            })
          }
        })
    }
  }, [id])

  // Get previous and next
  useEffect(() => {
    if (shuffle && shuffleSongs.length > 0) {
      let index = shuffleSongs.findIndex((s) => s.id === song.id)
      console.log(index)
      if (index === 0) {
        setPreviousSong(shuffleSongs[shuffleSongs.length - 1])
      } else {
        setPreviousSong(shuffleSongs[index + 1])
      }
      if (index === shuffleSongs.length - 1) {
        setNextSong(shuffleSongs[0])
      } else {
        setNextSong(shuffleSongs[index + 1])
      }
    } else {
      if (song != null) {
        fetch(`${server}/music/getRelated?id=${song.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              setNextSong(data.object[0])
              setPreviousSong(data.object[1])
            }
          })
      }
    }
  }, [song])

  // Get Genre data
  useEffect(() => {
    fetch(`${server}/genre/all`)
      .then((res) => res.json())
      .then((data) => {
        setGenreList(data.object)
      })
  }, [])

  // Get Author data
  useEffect(() => {
    fetch(`${server}/author/all`)
      .then((res) => res.json())
      .then((data) => {
        setAuthorList(data.object)
        console.log(data.object)
      })
  }, [])

  // Get songs count
  useEffect(() => {
    fetch(`${server}/music/count`)
      .then((res) => res.json())
      .then((data) => {
        setSongCount(data.object)
      })
  }, [])

  // Get shuffle
  useEffect(() => {
    if (shuffle) {
      setIsLoading(true)
      fetch(`${server}/music/all?shuffle=true`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false)
          setShuffleSongs(data.object)
          console.log(data.object)
          if (song != null) {
            let index = shuffleSongs.findIndex((s) => s.id === song.id)
            console.log(index)
            if (index === 0) {
              setPreviousSong(shuffleSongs[shuffleSongs.length - 1])
            } else {
              setPreviousSong(shuffleSongs[index + 1])
            }
            if (index === shuffleSongs.length - 1) {
              setNextSong(shuffleSongs[0])
            } else {
              setNextSong(shuffleSongs[index + 1])
            }
          }
        })
    }
  }, [shuffle])

  const play = () => {
    const audio = songRef.current

    audio.volumn = 0.1

    if (isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }

    if (!isPlaying) {
      setIsPlaying(true)
      audio.play()
    }
  }

  const mute = () => {
    setIsMuted(!isMuted)
  }

  const next = () => {
    if (!repeat || (repeat && playedSong.length < songCount)) {
      document.title = nextSong.name
      setPlayedSong((prevState) => [...prevState, song.id])
      localStorage.setItem("playing", nextSong.id)
      setSong(nextSong)
      setSongName(nextSong.name)
      setSongAuthor(nextSong.author.id)
      setSongGenre(nextSong.genre.id)
      setUpdateAt(nextSong.updateAt)
      setIsPlaying(true)
    } else {
      Swal.fire({
        title: "Oops!",
        text: "That's the end of your music, would you like to listen all again?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, play it!",
        cancelButtonText: "No, back to list songs!",
      }).then((result) => {
        if (result.isConfirmed) {
          setPlayedSong([])
          window.location.reload()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.href = "/"
        }
      })
    }
  }

  const previous = () => {
    document.title = previousSong.name
    var array = [...playedSong]
    array.pop()
    setPlayedSong(array)
    localStorage.setItem("playing", previousSong.id)
    setSong(previousSong)
    setSongName(previousSong.name)
    setSongAuthor(previousSong.author.id)
    setSongGenre(previousSong.genre.id)
    setUpdateAt(nextSong.updateAt)
    setIsPlaying(true)
  }

  const onChange = (value) => {
    const audio = songRef.current

    audio.currentTime = Math.round((value / 100) * duration)
  }

  const onEdit = () => {
    setIsEditing(true)
  }

  const onSave = () => {
    setIsLoading(true)
    fetch(`${server}/music/update`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      method: "PUT",
      body: JSON.stringify({
        id: song.id,
        name: songName,
        genre: songGenre,
        author: songAuthor,
      }),
    })
      .then((res) => {
        res.json()
        setIsLoading(false)
        setIsEditing(false)
        if (res.status === 401 || res.status === 403) {
          Swal.fire(t("fail"), t("nopermission"), "error")
        }
      })
      .then((data) => {
        setUpdateAt(new Date())
        Swal.fire(t("success"), "Thành công!", "success")
      })
  }

  const onDelete = () => {
    setIsLoading(true)
    fetch(`${server}/music/delete?id=${song.id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      method: "DELETE",
    })
      .then((res) => {
        setIsLoading(false)
        if (res.status === 401 || res.status === 403) {
          Swal.fire(t("fail"), t("nopermission"), "error")
        } else {
          res.json()
        }
      })
      .then((data) => {
        next()
        Swal.fire(t("success"), "Thành công!", "success")
        setIsEditing(false)
      })
  }

  const convertTime = (totalSeconds) => {
    var minutes = Math.floor(totalSeconds / 60)
    var seconds = Math.floor(totalSeconds - minutes * 60)
    if (seconds < 10) return minutes + ":0" + seconds
    return minutes + ":" + seconds
  }

  return (
    <div className="">
      {song ? (
        <>
          <div className="grid-player mr-auto ml-auto">
            <div className="inline-flex items-center justity-between w-full">
              <Link to="/">
                <div className="pointer rounded-md py-1">
                  <span class="material-icons">arrow_back</span>
                </div>
              </Link>
            </div>
            <div className="text-center text-base mb-2">
              <p className="">
                {t("nowPlaying")}:{" "}
                <span className="font-bold">{song.name}</span>
              </p>
              <p className="italic text-md">
                {nextSong ? t("upcoming") + ": " + nextSong.name : ""}
              </p>
            </div>
          </div>

          {/* Player */}
          <div className="player-container grid-player ml-auto mr-auto rounded-md shadow-md mb-4">
            <img
              className="rounded-t-md"
              width={400}
              heigh={400}
              alt={song.name}
              src={
                song.thumbnail ||
                "https://www.wyzowl.com/wp-content/uploads/2019/01/Ultimate-Guide-Stock-Music-Royalty-Free-Music-Custom-Music.png"
              }
            ></img>
            <div className="p-2">
              <Slider onChange={onChange} percentage={percentage} />

              <div className="inline-flex items-center justify-between w-full">
                <div>
                  <p className="font-medium">{convertTime(currentTime)}</p>
                </div>
                <div>
                  <p className="font-medium">{convertTime(duration)}</p>
                </div>
              </div>
              <div>
                <p className="text-center font-bold text-xl  mt-2">
                  {song.name}
                </p>
              </div>
              <div>
                <p className="text-center font-normal text-sm mt-2 mb-2">
                  {song.author.name}
                </p>
              </div>
              <div className="inline-flex items-center justify-between w-full p-2">
                <div
                  className="rounded-full shadow-2xl shadow-cyan-500/50 bg-cyan-500 w-12 h-12 inline-flex items-center justify-center pointer hover:scale-110"
                  onClick={() => previous()}
                >
                  <span class="material-icons text-white">skip_previous</span>
                </div>
                <div>
                  <div
                    className="rounded-full shadow-2xl shadow-cyan-500/50 bg-cyan-500 w-20 h-20 inline-flex items-center justify-center pointer hover:scale-110"
                    onClick={() => play()}
                  >
                    <span class="material-icons text-white">
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-full shadow-2xl shadow-cyan-500/50 bg-cyan-500 w-12 h-12 inline-flex items-center justify-center pointer hover:scale-110"
                  onClick={() => next()}
                >
                  <span class="material-icons text-white">skip_next</span>
                </div>
              </div>
              <div className="mr-auto ml-auto flex items-center justify-between mt-2">
                <audio
                  muted={isMuted}
                  ref={songRef}
                  src={song.src}
                  onLoadedData={(e) => {
                    let audio = songRef.current
                    var promise = audio.play()
                    setDuration(e.currentTarget.duration)

                    if (promise !== undefined) {
                      promise
                        .then((_) => {})
                        .catch((error) => {
                          setIsPlaying(false)
                          setPercentage(0)
                        })
                    }
                  }}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime)
                  }}
                />

                <Tooltip title="Shuffle">
                  <div>
                    <span
                      class={`material-icons pointer hover:text-cyan-500/50 ${
                        shuffle ? "text-cyan-500/50" : ""
                      }`}
                      onClick={() => {
                        localStorage.setItem("shuffle", !shuffle)
                        setShuffle(!shuffle)
                      }}
                    >
                      shuffle
                    </span>
                  </div>
                </Tooltip>

                <Tooltip title="Repeat all">
                  <div>
                    <span
                      class={`material-icons pointer hover:text-cyan-500/50 ${
                        repeat ? "text-cyan-500/50" : ""
                      }`}
                      onClick={() => {
                        localStorage.setItem("repeat", !repeat)
                        setRepeat(!repeat)
                      }}
                    >
                      replay
                    </span>
                  </div>
                </Tooltip>

                <Tooltip title={isMuted ? "volume_mute" : "volume_up"}>
                  <div>
                    <span
                      class="material-icons pointer hover:text-cyan-500/50"
                      onClick={() => mute()}
                    >
                      {isMuted ? "volume_mute" : "volume_up"}
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Details */}
          {isLogin ? (
            <div className="border p-2 rounded-md grid-player md:grid-600 mr-auto ml-auto mb-4">
              <p className="p-4 font-bold text-center border-b">
                {t("information")}
              </p>

              {/* Info */}
              <div className="grid grid-cols-5">
                <div className="items-center px-4 py-2 font-medium space-y-3 col-span-2">
                  <p className="text-sm py-2">{t("song_detail.name")}: </p>
                  <p className="text-sm py-2">{t("song_detail.author")}: </p>
                  <p className="text-sm py-2">{t("song_detail.genre")}: </p>
                  <p className="text-sm py-2">
                    {t("song_detail.last_updated")}:{" "}
                  </p>
                </div>
                <div className="items-center px-4 py-2 font-bold space-y-2 col-span-3">
                  <input
                    class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                    type="text"
                    value={songName}
                    onChange={(e) => {
                      setSongName(e.currentTarget.value)
                    }}
                    disabled={!isEditing}
                  />
                  <select
                    disabled={!isEditing}
                    value={songAuthor}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      console.log(e.currentTarget.value)
                      setSongAuthor(e.currentTarget.value)
                    }}
                  >
                    {authorList.map((author) => {
                      return (
                        <option key={author.id} value={author.id}>
                          <p class="dropdown-item pointer">{author.name}</p>
                        </option>
                      )
                    })}
                  </select>
                  <select
                    disabled={!isEditing}
                    value={songGenre}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      console.log(e.currentTarget.value)
                      setSongGenre(e.currentTarget.value)
                    }}
                  >
                    {genreList.map((genre) => {
                      return (
                        <option key={genre.id} value={genre.id}>
                          <p class="dropdown-item pointer">{genre.name}</p>
                        </option>
                      )
                    })}
                  </select>
                  <div className="w-full py-2">
                    <p className="">
                      {" "}
                      {moment(updateAt).format("hh:mm DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="inline-flex items-center justify-end w-full">
                {isEditing ? (
                  <div
                    className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-2/4"
                    onClick={() => onSave()}
                  >
                    <p className="text-center">{t("actions.save")}</p>
                  </div>
                ) : (
                  <div
                    className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-2/4"
                    onClick={() => onEdit()}
                  >
                    <p className="text-center"> {t("actions.edit")}</p>
                  </div>
                )}
                <div
                  className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
                  onClick={() => onDelete()}
                >
                  <p className="text-center"> {t("actions.delete")}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Loading */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            className="flex flex-col"
            // onClick={handleCloseLoading}
          >
            <p>Loading...</p>
            <CircularProgress className="mt-4" color="inherit" />
          </Backdrop>

          {/* Snackbar */}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isOpenSnackbar}
            autoHideDuration={6000}
            onClose={() => {
              setIsOpenSnackbar(false)
            }}
          >
            <p className="bg-yellow-200 px-4 py-2 rounded-md">
              I'm working on it...
            </p>
          </Snackbar>
        </>
      ) : null}
    </div>
  )
}
