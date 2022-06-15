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
  const songRef = useRef()

  const { t } = useTranslation()

  useEffect(() => {
    let p = Math.round((currentTime / duration) * 100)
    setPercentage(p)
  }, [currentTime])

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
    setIsEditing(false)
  }

  const onDelete = () => {}

  return (
    <div className="">
      {song ? (
        <>
          {/* Player */}
          <div className=" player-container d-flex align-items-center justify-content-center">
            <div>
              <span class="material-icons mt-3 pointer" onClick={() => play()}>
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </div>
            <div className="">
              <Slider onChange={onChange} percentage={percentage} />
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
              <span class="material-icons mt-3 pointer" onClick={() => mute()}>
                {isMuted ? "volume_mute" : "volume_up"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="border border-secondary p-2">
            <p className="p-4 fw-bold"> {t("song")}</p>
            <div className="border-bottom border-secondary"></div>
            <div className="p-4 fw-bold">
              <p>
                {t("song_detail.name")}:{" "}
                {isEditing ? (
                  <input className="ms-4" type="text" value={song.name} />
                ) : (
                  <span className="ms-4"> {song.name}</span>
                )}
              </p>
            </div>
            <div className="p-4 fw-bold">
              <p>
                {t("song_detail.genre")}:
                {isEditing ? (
                  <input className="ms-4" type="text" value={song.genre} />
                ) : (
                  <span className="ms-4"> {song.genre}</span>
                )}
              </p>
            </div>
            <div className="p-4 fw-bold">
              <p>
                {t("song_detail.last_updated")}:
                <span className="ms-4">
                  {" "}
                  {moment(song.lastUpdate || new Date()).format(
                    "h:mm DD/MM/YYYY"
                  )}
                </span>
              </p>
            </div>

            <div className="d-flex justify-content-start"></div>

            <div className="d-flex justify-content-end">
              <button
                className="px-4 py-1"
                onClick={() => props.callback("goback", "")}
              >
                {t("actions.back")}
              </button>
              {isEditing ? (
                <>
                  <button className="px-4 py-1 ms-4" onClick={() => onSave()}>
                    {t("actions.save")}
                  </button>
                  <button className="px-4 py-1 ms-4" onClick={() => onDelete()}>
                    {t("actions.delete")}
                  </button>
                </>
              ) : (
                <>
                  <button className="px-4 py-1 ms-4" onClick={() => onEdit()}>
                    {t("actions.edit")}
                  </button>
                  <button className="px-4 py-1 ms-4" onClick={() => onDelete()}>
                    {t("actions.delete")}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
