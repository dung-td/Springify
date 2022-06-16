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
      <div className="inline-flex items-center justify-between w-full">
        <div className="inline-flex items-center justify-between w-1/3">
          <div
            className="rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/2"
            onClick={() => add()}
          >
            <p className="text-center">{t("actions.add")}</p>
          </div>
          <div className="rounded-md border border-gray-200 p-2 mb-2 w-1/2">
            <p className="text-center">{t("actions.delete")}</p>
          </div>
        </div>

        <div class="">
          <input
            type="search"
            class="block px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
            placeholder={t("actions.search")}
            required
          />
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-xl uppercase mb-2">Danh sách bài hát</p>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3" scope="col">
                <input type="checkbox"></input>
              </th>
              <th className="px-6 py-3" scope="col">
                {t("song_detail.name")}
              </th>
              <th className="px-6 py-3" scope="col">
                {t("song_detail.author")}
              </th>
              <th className="px-6 py-3" scope="col">
                {t("song_detail.genre")}
              </th>
              <th className="px-6 py-3" scope="col">
                {t("action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {songList.map((song) => {
              return (
                <tr class="bg-white border-b text-black" key={song.id}>
                  <th class="px-6 py-4" scope="col">
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
                  <td class="px-6 py-4 font-bold ">{song.name}</td>

                  <td class="px-6 py-4">{song.author}</td>

                  <td class="px-6 py-4">{song.genre}</td>

                  <td class="px-6 py-4 space-x-2">
                    <span
                      class="material-icons pointer"
                      onClick={() => {
                        console.log(song.id)
                        play(song.id)
                      }}
                    >
                      play_arrow
                    </span>
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

      <div className="inline-flex justify-between items-center w-full p-4">
        <div>
          <p className="text-xl">
            {t("total_items")}: {songList.length}{" "}
          </p>
          <p className="text-xl">
            {t("selected_items")}: {selectedSongs.length}
          </p>
        </div>

        <div>
          <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option selected>Page size</option>
            <option value="US">5</option>
            <option value="CA">10</option>
            <option value="FR">15</option>
            <option value="DE">20</option>
          </select>
        </div>
      </div>
    </div>
  )
}
