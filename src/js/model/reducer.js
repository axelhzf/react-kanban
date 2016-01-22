import Immutable from "immutable";

const reducerFunctions = {

  CREATE_TASK: (state, action) => {
    const taskWithMaxId = state.get("tasks").maxBy(task => task.get("id"));
    const currentMaxId = taskWithMaxId ? taskWithMaxId.get("id") : 1;

    const nextId = currentMaxId + 1;

    const task = Immutable.Map(action.task)
      .merge({id: nextId, column: "backlog"});

    return state.updateIn(["tasks"], tasks => tasks.push(task));
  },

  DELETE_TASK: (state, action) => {
    const taskToDelete = action.task;
    const newState = state.updateIn(["tasks"], tasks => tasks.filter(task => task !== taskToDelete));
    return newState;
  },

  MOVE_TASK_TO_COLUMN: (state, action) => {
    const {column} = action;
    const taskJs = action.task; //task is not immutable (fuck react dnd)

    const tasks = state.get("tasks");
    const task = tasks.find(task => task.get("id") === taskJs.id);
    const taskIndex = tasks.findIndex((t) => t === task);
    const newTask = task.set("column", column.get("id"));

    const newState = state.updateIn(["tasks"], tasks => {
      return tasks.splice(taskIndex, 1).push(newTask)
    });

    return newState;
  },

  MOVE_TASK_NEXT_TO_TASK: (state, action) => {
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
  },

  NEW_TASK_NAME_CHANGE: (state, action) => {
    return state.set("newTaskName", action.name);
  }

};

export default (state = initialState, action) => {
  const fn = reducerFunctions[action.type];
  if (fn) {
    return fn(state, action);
  }
  console.warn("Reducer not defined for event", action);
  return state;
}

