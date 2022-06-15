import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { server } from "../interfaces/server"

export const ListSong = (props) => {
  const [songList, setSongList] = useState([])

  const [selectedSongs, setSeletedSongs] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    fetch(`${server}/music/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          let songs = new Array()
          data.object.forEach((song) => {
            songs.push({
              id: song.id,
              name: song.name,
              author: song.author,
              genre: song.genre,
              updateAt: song.updateAt,
            })
            setSongList(songs)
          })
        }
      })
  }, [])

  const play = (id) => {
    console.log(id)
    props.callback("play", id)
  }

  const edit = (id) => {
    props.callback("edit", id)
  }

  const add = (id) => {
    props.callback("add", id)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <button className="m-2 px-4 py-1" onClick={() => add()}>
            {t("actions.add")}
          </button>
          <button className="m-2 px-4 py-1">{t("actions.delete")}</button>
        </div>

        <div class="">
          <input
            type="text"
            class="form-control"
            placeholder={t("actions.search")}
          />
        </div>
      </div>

      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">
                <input type="checkbox"></input>
              </th>
              <th scope="col">{t("song_detail.name")}</th>
              <th scope="col">{t("song_detail.author")}</th>
              <th scope="col">{t("song_detail.genre")}</th>
              <th scope="col">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {songList.map((song) => {
              return (
                <tr key={song.id}>
                  <th scope="col">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSeletedSongs((prevState) => [
                            ...prevState,
                            song.id,
                          ])
                          console.log(selectedSongs)
                        } else {
                          let index = selectedSongs.indexOf(song.id)
                          selectedSongs.splice(index, 1)
                        }
                      }}
                    ></input>
                  </th>
                  <td>{song.name}</td>

                  <td>{song.author}</td>

                  <td>{song.genre}</td>

                  <td>
                    <span
                      class="material-icons pointer"
                      onClick={() => {
                        console.log(song.id)
                        play(song.id)
                      }}
                    >
                      play_arrow
                    </span>
                  </td>
                  <td>
                    <span
                      class="material-icons pointer"
                      onClick={() => edit(song.id)}
                    >
                      edit
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p>
            {t("total_items")}: {songList.length}{" "}
          </p>
          <p>
            {t("selected_items")}: {selectedSongs.length}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center me-2">
            <p>Page size</p>
            <div class="dropdown ms-2">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                25
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#">
                    25
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    50
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    100
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <input type="number"></input>
          </div>
        </div>
      </div>
    </div>
  )
}
