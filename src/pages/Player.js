import React, { useRef, useState, useEffect } from "react"
import moment from "moment"
import { useTranslation } from "react-i18next"

import { Slider } from "../components/Slider"
import { server } from "../interfaces/server"

export const Player = (props) => {
  const [isEditing, setIsEditing] = useState(
    props.mode === "edit" ? true : false
  )

  const [percentage, setPercentage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [song, setSong] = useState()
  const [songName, setSongName] = useState()
  const [songAuthor, setSongAuthor] = useState()
  const [songGenre, setSongGenre] = useState()
  const songRef = useRef()

  const { t } = useTranslation()

  useEffect(() => {
    let p = Math.round((currentTime / duration) * 100)
    setPercentage(p)
  }, [currentTime])

  // Get music data
  useEffect(() => {
    fetch(`${server}/music?id=${props.song}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          setSong(data.object)
        }
      })
  }, [])

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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        id: song.id,
        name: songName,
        genre: songGenre,
        author: songAuthor,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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
          {/* Player */}
          <div className="player-container">
            <Slider onChange={onChange} percentage={percentage} />
            <div className="grid-400 mr-auto ml-auto flex items-center justify-between">
              <div className="inline-flex items-center justify-center mr-2">
                <div>
                  <span class="material-icons mt-3 pointer">skip_previous</span>
                </div>
                <div>
                  <span
                    class="material-icons mt-3 pointer"
                    onClick={() => play()}
                  >
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </div>
                <div>
                  <span class="material-icons mt-3 pointer">skip_next</span>
                </div>
              </div>
              <div className="inline-flex items-center justify-center">
                <div>
                  <p className="font-medium">{convertTime(currentTime)}</p>
                </div>
                <div>
                  <span class="material-icons">minimize</span>
                </div>
                <div>
                  <p className="font-medium">{convertTime(duration)}</p>
                </div>
              </div>

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

              <div>
                <span
                  class="material-icons h-full mt-3 pointer"
                  onClick={() => mute()}
                >
                  {isMuted ? "volume_mute" : "volume_up"}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border p-2 rounded-md grid-400 mr-auto ml-auto">
            <p className="p-4 font-bold text-center border-b">
              {song.name + " - " + song.author}{" "}
            </p>
            <div className="grid grid-cols-3">
              <div className="items-center px-4 py-2 font-medium space-y-3">
                <p className="px-4 py-2">{t("song_detail.name")}: </p>
                <p className="px-4 py-2">{t("song_detail.author")}: </p>
                <p className="px-4 py-2">{t("song_detail.genre")}: </p>
                <p className="px-4 py-2">{t("song_detail.last_updated")}: </p>
              </div>
              <div className="items-center px-4 py-2 font-bold space-y-3 col-span-2">
                <input
                  class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                  type="text"
                  defaultValue={song.name}
                  onChange={(e) => {
                    e.preventDefault()
                    setSongName(e.currentTarget.value)
                  }}
                  disabled={!isEditing}
                />
                <input
                  class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                  type="text"
                  defaultValue={song.author}
                  onChange={(e) => {
                    e.preventDefault()
                    setSongAuthor(e.currentTarget.value)
                  }}
                  disabled={!isEditing}
                />
                <input
                  class="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
                  type="text"
                  defaultValue={song.genre}
                  onChange={(e) => {
                    e.preventDefault()
                    setSongGenre(e.currentTarget.value)
                  }}
                  disabled={!isEditing}
                />
                <div className="w-full px-4 py-2">
                  <p className="py-2">
                    {" "}
                    {moment(song.lastUpdate || new Date()).format(
                      "h:mm DD/MM/YYYY"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center justify-end w-full">
              <div
                className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
                onClick={() => props.callback("goback", "")}
              >
                <p className="text-center">{t("actions.back")}</p>
              </div>
              {isEditing ? (
                <div
                  className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
                  onClick={() => onSave()}
                >
                  <p className="text-center">{t("actions.save")}</p>
                </div>
              ) : (
                <div
                  className="pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/4"
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
        </>
      ) : null}
    </div>
  )
}
