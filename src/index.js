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
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      ></link>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
    </head>

    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk"
      crossorigin="anonymous"
    ></script>
  </React.StrictMode>
)

reportWebVitals()
