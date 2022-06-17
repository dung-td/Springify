import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

import { server } from "../interfaces/server"

export const ListSong = (props) => {
  const [isLogin, setIsLogin] = useState(false)
  const [songList, setSongList] = useState([])
  const [selectedSongs, setSelectedSongs] = useState([])
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(5)
  const [pageCount, setPageCount] = useState([])
  const [selectedAll, setSelectedAll] = useState(false)

  useEffect(() => {
    if (selectedAll) {
      songList.forEach((song) => {
        setSelectedSongs((prevState) => [...prevState, song.id])
      })
    } else {
      setSelectedSongs([])
    }
  }, [selectedAll])

  useEffect(() => {
    fetch(`${server}/music/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          let songs = new Array()
          let length = data.object.length
          if (length / limit < parseInt(length / limit)) {
            length = length / limit
          } else {
            length = length / limit + 1
          }
          setPageCount(Array.from(Array(parseInt(length)).keys()))
        }
      })
  }, [limit])

  useEffect(() => {
    fetch(`${server}/music/page?page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          setSongList(data.object.songs)
        }
      })
  }, [currentPage, limit])

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

  const _delete = () => {
    console.log()
  }

  console.log(selectedSongs)

  return (
    <div>
      <div className="inline-flex items-center justify-between w-full">
        {isLogin ? (
          <div className="inline-flex items-center justify-between w-1/3">
            <div
              className="cursor-pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/2"
              onClick={() => add()}
            >
              <p className="text-center">{t("actions.add")}</p>
            </div>
            <div
              className="cursor-pointer rounded-md border border-gray-200 p-2 mb-2 w-1/2"
              onClick={() => _delete()}
            >
              <p className="text-center">{t("actions.delete")}</p>
            </div>
          </div>
        ) : null}

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
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedAll(!selectedAll)
                  }}
                ></input>
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
                      checked={selectedSongs.includes(song.id)}
                      onClick={(e) => {
                        if (
                          !e.target.checked &&
                          selectedSongs.includes(song.id)
                        ) {
                          var array = [...selectedSongs]
                          let index = array.indexOf(song.id)
                          if (index !== -1) {
                            array.splice(index, 1)
                            setSelectedSongs(array)
                          }
                        }
                      }}
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          !selectedSongs.includes(song.id)
                        ) {
                          setSelectedSongs((prevState) => [
                            ...prevState,
                            song.id,
                          ])
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
                    {isLogin ? (
                      <span
                        class="material-icons pointer"
                        onClick={() => edit(song.id)}
                      >
                        edit
                      </span>
                    ) : null}
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
          <select
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            onChange={(e) => {
              setLimit(e.currentTarget.value)
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <nav className="text-center">
        <ul class="inline-flex -space-x-px">
          <li>
            <a
              class="cursor-pointer py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => {
                setCurrentPage(pageCount[0])
              }}
            >
              Previous
            </a>
          </li>
          {pageCount.map((page) => {
            return (
              <li>
                {currentPage == page ? (
                  <a
                    class="cursor-pointer py-2 px-3 text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => {
                      setCurrentPage(page)
                    }}
                  >
                    {page + 1}
                  </a>
                ) : (
                  <a
                    class="cursor-pointer py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => {
                      setCurrentPage(page)
                    }}
                  >
                    {page + 1}
                  </a>
                )}
              </li>
            )
          })}

          <li>
            <a
              class="cursor-pointer py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => {
                setCurrentPage(pageCount[pageCount.length - 1])
              }}
            >
              Last
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
