import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import bootstrap from "bootstrap"
import reportWebVitals from "./reportWebVitals"

import i18n from "./i18n"
import { I18nextProvider } from "react-i18next"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <head>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
    </head>

    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
)

reportWebVitals()
