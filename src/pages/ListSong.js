import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { server } from "../interfaces/server"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Swal from "sweetalert2"

export const ListSong = (props) => {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("jwt") != null ? true : false
  )

  const [songList, setSongList] = useState([])
  const [selectedSongs, setSelectedSongs] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState([])
  const [selectedAll, setSelectedAll] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [genreList, setGenreList] = useState([])
  const [authorList, setAuthorList] = useState([])

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
    fetch(
      `${server}/music/count?name=${keyword}&author=${author}&genre=${genre}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          let length = data.object
          if (length / limit <= parseInt(length / limit)) {
            length = length / limit
          } else {
            length = length / limit + 1
          }
          setPageCount(Array.from(Array(parseInt(length)).keys()))
        }
      })
  }, [limit, keyword, author, genre])

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
      })
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetch(
      `${server}/music/page?page=${currentPage}&limit=${limit}&&name=${keyword}&author=${author}&genre=${genre}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setIsLoading(false)
          setSongList(data.object.songs)
        } else {
          setIsLoading(false)
        }
      })
  }, [currentPage, limit, keyword, author, genre])

  const _delete = () => {
    setIsLoading(true)
    let stringUrl = server + "/music/delete"
    let url = new URL(stringUrl)
    let params = url.searchParams

    selectedSongs.forEach((song) => {
      params.append("id", song)
    })
    let link = url.toString()
    fetch(`${link}`, {
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
        Swal.fire(t("success"), "Thành công!", "success").then(() => {
          window.location.reload()
        })
      })
  }

  return (
    <div className="mt-4">
      {isLogin ? (
        <div className="inline-flex items-center justify-between w-full">
          <div className="cursor-pointer rounded-md border border-gray-200 p-2 mb-2 mr-4 w-1/2">
            <Link to="/add">
              <p className="text-center">{t("actions.add")}</p>
            </Link>
          </div>
          <div
            className="cursor-pointer rounded-md border border-gray-200 p-2 mb-2 w-1/2"
            onClick={() => _delete()}
          >
            <p className="text-center">{t("actions.delete")}</p>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        <div className="inline-flex items-center justify-between w-full h-full md:w-2/12 p-2">
          <select
            value={genre}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            onChange={(e) => {
              console.log(e.currentTarget.value)
              setGenre(e.currentTarget.value)
            }}
          >
            <option key={"all"} value="">
              {t("all")}
            </option>
            {genreList.map((genre) => {
              return (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="inline-flex items-center justify-between w-full h-full md:w-2/12 p-2">
          <select
            value={author}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            onChange={(e) => {
              console.log(e.currentTarget.value)
              setAuthor(e.currentTarget.value)
            }}
          >
            <option key={"all"} value="">
              {t("all")}
            </option>
            {authorList.map((author) => {
              return (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="inline-flex items-center justify-between w-full h-full md:w-8/12 p-2">
          <input
            type="search"
            className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300"
            placeholder={t("actions.search")}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.currentTarget.value)
            }}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-xl uppercase mb-2">
          {t("songList").toUpperCase()}
        </p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 table-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {isLogin ? (
                <th className="px-6 py-3" scope="col">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedAll(!selectedAll)
                    }}
                  ></input>
                </th>
              ) : null}
              <th className="px-6 py-3" scope="col">
                {t("song_detail.name")}
              </th>
              <th className="px-6 py-3" scope="col">
                {t("song_detail.author")}
              </th>
              <th className="px-6 py-3" scope="col">
                {t("song_detail.genre")}
              </th>
              {isLogin ? (
                <th className="px-6 py-3" scope="col">
                  {t("action")}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {songList.map((song) => {
              return (
                <tr
                  className="bg-white border-b text-black hover:bg-gray-200 hover:cursor-pointer"
                  key={song.id}
                  // onClick={() => (window.location.href = "/play/" + song.id)}
                >
                  {isLogin ? (
                    <th className="px-6 py-4" scope="col">
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
                  ) : null}

                  <td className="text-xs md:text-base px-6 py-4 font-bold ">
                    {song.name}
                  </td>

                  <td className="text-xs md:text-base px-6 py-4">
                    {song.author.name}
                  </td>

                  <td className="text-xs md:text-base px-6 py-4">
                    {song.genre.name}
                  </td>

                  {isLogin ? (
                    <td className="text-xs md:text-base px-6 py-4 space-x-2">
                      <Link to={`/play/${song.id}`}>
                        <span className="material-icons pointer">
                          play_arrow
                        </span>
                      </Link>
                      <Link to={`/edit/${song.id}`}>
                        <span className="material-icons pointer">edit</span>
                      </Link>
                    </td>
                  ) : null}
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
            defaultValue={limit}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
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
        <ul className="inline-flex -space-x-px items-center">
          <li>
            <p
              className="cursor-pointer py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => {
                setCurrentPage(pageCount[0])
              }}
            >
              {t("previous")}
            </p>
          </li>
          {pageCount.map((page) => {
            return (
              <li key={page}>
                {currentPage === page ? (
                  <p
                    className="cursor-pointer py-2 px-3 text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => {
                      setCurrentPage(page)
                    }}
                  >
                    {page + 1}
                  </p>
                ) : (
                  <p
                    className="cursor-pointer py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => {
                      setCurrentPage(page)
                    }}
                  >
                    {page + 1}
                  </p>
                )}
              </li>
            )
          })}

          <li>
            <p
              className="cursor-pointer py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => {
                setCurrentPage(pageCount[pageCount.length - 1])
              }}
            >
              {t("last")}
            </p>
          </li>
        </ul>
      </nav>

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
