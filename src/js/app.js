import style from "../css/main.css";
import fontAwesome from "font-awesome/css/font-awesome.css";

import React from "react";
import ReactDom from "react-dom";
import { Provider } from 'react-redux';

import BoardPage from "./pages/BoardPage";
import store from "./model/store";
import DevTools from "./DevTools";

const root = (
  <Provider store={store}>
    <div>
      <BoardPage/>
      <DevTools/>
    </div>
  </Provider>
);
ReactDom.render(root, document.getElementById("content"));