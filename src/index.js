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
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <title>Springify</title>
    </head>

    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
)

reportWebVitals()
