import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from "@mui/material/styles"
import { GoogleOAuthProvider } from '@react-oauth/google'
import theme from "./data/theme"
import { Provider } from "react-redux"
import { setupStore } from "./store/store"

const root = ReactDOM.createRoot(document.getElementById('root'))

const store = setupStore()

root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </Provider>
    </Router>
  </React.StrictMode>
)

reportWebVitals()
