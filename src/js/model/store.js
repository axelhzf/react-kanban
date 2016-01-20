import { compose, createStore } from 'redux';
import Immutable from "immutable";
import DevTools from "../DevTools";

const initialState = Immutable.fromJS({
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

function reducer(state = initialState, action) {
  const fn = reducerFunctions[action.type];
  if (fn) {
    return fn(state, action);
  }

  console.warn("Reducer not defined for event", action);
  return state;
}

const reducerFunctions = {

  "CREATE_TASK": (state, action) => {
    const taskWithMaxId = state.get("tasks").maxBy(task => task.get("id"));
    const currentMaxId = taskWithMaxId ? taskWithMaxId.get("id") : 1;

    const nextId = currentMaxId + 1;

    const task = Immutable.Map(action.task)
      .merge({id: nextId, column: "backlog"});

    return state.updateIn(["tasks"], tasks => tasks.push(task));
  },

  "DELETE_TASK": (state, action) => {
    const taskToDelete = action.task;
    const newState = state.updateIn(["tasks"], tasks => tasks.filter(task => task !== taskToDelete));
    return newState;
  },

  "MOVE_TASK_TO_COLUMN": (state, action) => {
    const {column} = action;
    const taskJs = action.task;

    const tasks = state.get("tasks");
    const task = tasks.find(task => task.get("id") === taskJs.id);
    const taskIndex = tasks.findIndex((t) => t === task);
    const newTask = task.set("column", column.get("id"));

    const newState = state.updateIn(["tasks"], tasks => {
      return tasks.splice(taskIndex, 1).push(newTask)
    });

    return newState;
  },

  "MOVE_TASK_NEXT_TO_TASK": (state, action) => {
    var {toTask} = action;
    var fromTaskJs = action.fromTask; //task is not immutable (fuck react dnd)

    const tasks = state.get("tasks");

    const toTaskIndex = tasks.indexOf(toTask);
    const fromTaskIndex = tasks.findIndex((task) => task.get("id") === fromTaskJs.id);
    const fromTask = tasks.get(fromTaskIndex);

    const newState = state.updateIn(["tasks"], tasks => {
      return tasks.splice(fromTaskIndex, 1).splice(toTaskIndex, 0, fromTask);
    });

    return newState;
  }

};

const finalCreateStore = compose(
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