import React, { useRef, useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import moment from "moment"
import { useTranslation } from "react-i18next"

import { Slider } from "../components/Slider"
import { server } from "../interfaces/server"
import Swal from "sweetalert2"

export const Player = () => {
  let { id } = useParams()
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("jwt") != null ? true : true
  )
  const [isEditing, setIsEditing] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [song, setSong] = useState()
  const [nextSong, setNextSong] = useState()
  const [previousSong, setPreviousSong] = useState()
  const [songName, setSongName] = useState()
  const [songAuthor, setSongAuthor] = useState()
  const [songGenre, setSongGenre] = useState()
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
    if (id !== undefined) {
      fetch(`${server}/music/get?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            setSong(data.object)
            setSongName(data.object.name)
            setSongAuthor(data.object.author)
            setSongGenre(data.object.genre)
          }
        })
    }
  }, [id])

  // Get previous and next
  useEffect(() => {
    console.log(song)
    if (song != null) {
      fetch(`${server}/music/getRelated?id=${song.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "ok") {
            setNextSong(data.object[0])
            setPreviousSong(data.object[1])
          }
        })
    }
  }, [song])

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
    setSong(nextSong)
    setSongName(nextSong.name)
    setSongAuthor(nextSong.author)
    setSongGenre(nextSong.genre)
    setIsPlaying(true)
  }

  const previous = () => {
    setSong(previousSong)
    setSongName(previousSong.name)
    setSongAuthor(previousSong.author)
    setSongGenre(previousSong.genre)
    setIsPlaying(true)
  }

  const onChange = (value) => {
    console.log(value)
    const audio = songRef.current

    audio.currentTime = Math.round((value / 100) * duration)
  }

  const onEdit = () => {
    setIsEditing(true)
  }

  const onSave = () => {
    console.log(song)
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
        if (res.status === 401 || res.status === 403) {
          Swal.fire(t("fail"), t("nopermission"), "error")
        } else {
          res.json()
        }
      })
      .then((data) => {
        Swal.fire(t("success"), "Thành công!", "success")
        setIsEditing(false)
      })
  }

  const onDelete = () => {}

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
                  {song.author}
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
                    audio.play()
                    console.log(e.currentTarget.duration)
                    setDuration(e.currentTarget.duration)
                  }}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime)
                  }}
                />

                <span class="material-icons pointer hover:text-cyan-500/50">
                  shuffle
                </span>

                <span class="material-icons pointer hover:text-cyan-500/50">
                  replay
                </span>

                <span
                  class="material-icons pointer hover:text-cyan-500/50"
                  onClick={() => mute()}
                >
                  {isMuted ? "volume_mute" : "volume_up"}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          {isLogin ? (
            <div className="border p-2 rounded-md grid-player md:grid-600 mr-auto ml-auto mb-4">
              <p className="p-4 font-bold text-center border-b">
                {t("information")}
              </p>
              <div className="grid grid-cols-5">
                <div className="items-center px-4 py-2 font-medium space-y-3 col-span-2">
                  <p className="text-sm  py-2">{t("song_detail.name")}: </p>
                  <p className="text-sm  py-2">{t("song_detail.author")}: </p>
                  <p className="text-sm  py-2">{t("song_detail.genre")}: </p>
                  <p className="text-sm  py-2">
                    {t("song_detail.last_updated")}:{" "}
                  </p>
                </div>
                <div className="items-center px-4 py-2 font-bold space-y-3 col-span-3">
                  <input
                    class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                    type="text"
                    value={songName}
                    onChange={(e) => {
                      setSongName(e.currentTarget.value)
                    }}
                    disabled={!isEditing}
                  />
                  <input
                    class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                    type="text"
                    value={songAuthor}
                    onChange={(e) => {
                      setSongAuthor(e.currentTarget.value)
                    }}
                    disabled={!isEditing}
                  />
                  <input
                    class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                    type="text"
                    value={songGenre}
                    onChange={(e) => {
                      setSongGenre(e.currentTarget.value)
                    }}
                    disabled={!isEditing}
                  />
                  <div className="w-full">
                    <p className="">
                      {" "}
                      {moment(song.updateAt).format("hh:mm DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>

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
        </>
      ) : null}
    </div>
  )
}
