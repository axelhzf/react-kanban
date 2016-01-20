import React from "react";
import _ from "lodash";

import Board from "../components/board/Board";
import Column from "../components/board/Column";
import Task from "../components/board/Task";
import AddTaskInput from "../components/board/AddTaskInput";

import taskDao from "../model/TaskDao";

export default class BoardPage extends React.Component {

  state = {
    columns: [
      {id: "backlog", name: "Backlog"},
      {id: "progress", name: "In progress"},
      {id: "qa", name: "QA"}
    ],
    tasks: taskDao.findAll()
  };

  componentDidMount() {
    taskDao.on("change", this.onTaskChange);
  }

  componentWillUnmount() {
    taskDao.off("change", this.onTaskChange);
  }

  onTaskChange = () => {
    this.setState({tasks: taskDao.findAll()});
  };

  onMoveTask = (task, column) => {
    task.column = column.id;
    taskDao.update(task);
  };

  onAddTask = (task) => {
    taskDao.create(task);
  };

  onDeleteTask = (task) => {
    taskDao.remove(task);
  };

  render() {
    const {columns, tasks} = this.state;
    const tasksByColumns = _.groupBy(tasks, "column");

    return (
      <div>
        <Board>
          {
            _.map(columns, (column) => (
              <Column key={column.id} column={column}>
                {
                  _.map(tasksByColumns[column.id], (task) => (
                    <Task key={task.id} task={task} onMoveTask={this.onMoveTask} onDeleteTask={this.onDeleteTask}/>
                  ))
                }
              </Column>
            ))
          }
        </Board>
        <AddTaskInput onAddTask={this.onAddTask}/>
      </div>
    )
  }

}


