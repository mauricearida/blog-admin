import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import SearchProvider from "./context/SearchProvider";
import NotificationProvider from "./context/NotificationProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <NotificationProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </NotificationProvider>
  </BrowserRouter>
);
