import React from "react"
import { useTranslation } from "react-i18next"

export const AddSong = (props) => {
  const { t } = useTranslation()

  const back = () => {
    props.callback("goback", "")
  }

  return (
    <div className="border border-secondary p-4 mt-4">
      <p className="fw-bold">{t("actions.add") + " " + t("song")}</p>

      <div className="border-bottom border-secondary"></div>

      <div>
        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.name")}:</p>
          <input type="text"></input>
        </div>

        <div className="d-flex align-items-center mt-2">
          <p className="mb-0 me-2">{t("song_detail.genre")}:</p>
          <input type="text"></input>
        </div>

        <div className="mt-2">
          <input type="file"></input>
        </div>

        <div className="d-flex justify-content-end">
          <button className="px-4 py-1" onClick={() => back()}>
            {t("actions.back")}
          </button>
          <button className="px-4 py-1 ms-2">{t("actions.add")}</button>
        </div>
      </div>
    </div>
  )
}
