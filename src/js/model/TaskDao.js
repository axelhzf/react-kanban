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
    this.tasks.push({id: this.tasks.length + 1, name: task.name, column: "backlog"});
    this._save();
  }

  remove(task) {
    this.tasks = _.without(this.tasks, task);
    this._save();
  }

  _save() {
    window.localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.emit("change");
  }

}

export default new TaskDao();