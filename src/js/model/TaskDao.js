import _ from "lodash";
import Emitter from "component-emitter";

class TaskDao extends Emitter {

  constructor() {
    super();

    this.tasks = [];
    try {
      this.tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
    } catch (e) {

    }
  }

  findAll() {
    return this.tasks;
  }

  update(task) {
    const taskIndex = _.findIndex(this.tasks, {id: task.id});
    this.tasks[taskIndex] = task;
    this._save();
  }

  create(task) {
    const currentMaxId = _.max(_.map(this.tasks, "id")) || 1;
    const nextId = currentMaxId + 1;
    this.tasks.push({id: nextId, name: task.name, column: "backlog"});
    this._save();
  }

  remove(task) {
    this.tasks = _.without(this.tasks, task);
    this._save();
  }

  reorder(dragTask, hoverTask) {
    console.log("hover task", hoverTask);
    const hoverTaskIndex = _.findIndex(this.tasks, {id : hoverTask.id});
    this.tasks = _.without(this.tasks, dragTask);
    console.log(hoverTaskIndex);
    this.tasks.splice(hoverTaskIndex, 0, dragTask);
    dragTask.column = hoverTask.column;

    this._save();
  }

  _save() {
    window.localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.emit("change");
  }

}

export default new TaskDao();