import style from "../css/main.css";
import fontAwesome from "font-awesome/css/font-awesome.css";

import React from "react";
import ReactDom from "react-dom";

import BoardPage from "./pages/BoardPage";

ReactDom.render(<BoardPage/>, document.getElementById("content"));