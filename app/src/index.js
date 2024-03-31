import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
// import Navbar from "./Navbar";
import News from "./News";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
          {/* Route for the chatbot component */}
          <Route index element={<App />} />
          {/* Route for the news component */}
          <Route path="news" element={<News />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
