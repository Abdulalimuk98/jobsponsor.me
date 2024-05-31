import React from "react";
import ReactDOMClient from "react-dom/client";
import { SearchPage } from "./screens/SearchPage";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<SearchPage />);
