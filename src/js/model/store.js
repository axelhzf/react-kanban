import Immutable from "immutable";
import { compose, createStore, applyMiddleware } from 'redux';
import reducer from "./reducer"
import DevTools from "../DevTools";

const initialState = Immutable.fromJS({
  newTaskName: "",
  columns: [
    {id: "backlog", name: "Backlog"},
    {id: "progress", name: "In progress"},
    {id: "qa", name: "QA"}
  ],
  tasks: [
    {id: 1, name: "A", column: "backlog"},
    {id: 2, name: "B", column: "backlog"},
    {id: 3, name: "C", column: "progress"}
  ]
});

const logMiddleware = store => next => action => {
  console.log("Dispatch", action);
  next(action);
  console.log("Next state", store.getState().toJS());
};

const middleware = [logMiddleware];

const finalCreateStore = compose(
  applyMiddleware(...middleware),
  DevTools.instrument()
)(createStore);

const state = readStateFromLocalStorage() || initialState;
const store = finalCreateStore(reducer, state);

store.subscribe(() => {
  window.localStorage.setItem("redux", JSON.stringify(store.getState().toJS()));
});

function readStateFromLocalStorage() {
  try {
    return Immutable.fromJS(JSON.parse(window.localStorage.getItem("redux")));
  } catch(e) {
    console.warn("Error reading state from localStorage", e);
  }
}

export default store;