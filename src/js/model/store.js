import { compose, createStore } from 'redux';
import persistState from 'redux-localstorage'

const initialState = {
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
};

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
    const currentMaxId = _.max(_.map(state.tasks, "id")) || 1;
    const nextId = currentMaxId + 1;
    const newTask = _.assign({}, action.task, {id: nextId, column: "backlog"});

    let tasks = [...state.tasks, newTask];
    return _.assign({}, state, {tasks});
  },

  "DELETE_TASK": (state, action) => {
    const task = action.task;
    const taskIndex = _.findIndex(state.tasks, {id: task.id});

    let tasks =  [
      ...state.tasks.slice(0, taskIndex),
      ...state.tasks.slice(taskIndex + 1)
    ];

    return _.assign({}, state, {tasks});
  },

  "MOVE_TASK_TO_COLUMN": (state, action) => {
    const {task, column} = action;
    const taskIndex = _.findIndex(state.tasks, {id: task.id});

    let tasks =  [
      ...state.tasks.slice(0, taskIndex),
      _.assign({}, task, {column: column.id}),
      ...state.tasks.slice(taskIndex + 1)
    ];

    return _.assign({}, state, {tasks});
  },

  "MOVE_TASK_NEXT_TO_TASK": (state, action) => {
    const {tasks} = state;
    const {fromTask, toTask} = action;

    const toTaskIndex = _.findIndex(tasks, {id : toTask.id});
    const fromTaskIndex = _.findIndex(tasks, {id: fromTask.id});

    var newTasks = [
      ...tasks.slice(0, fromTaskIndex),
      ...tasks.slice(fromTaskIndex + 1)
    ];
    newTasks = [
      ...newTasks.slice(0, toTaskIndex),
      fromTask,
      ...newTasks.slice(toTaskIndex)
    ];

    return _.assign({}, state, {tasks: newTasks});
  }

};

const createPersistentStore = compose(
  persistState()
)(createStore);
export default createPersistentStore(reducer)