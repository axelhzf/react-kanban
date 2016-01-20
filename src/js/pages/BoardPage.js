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

  onChangeColumn = (task, column) => {
    task.column = column.id;
    taskDao.update(task);
  };

  onAddTask = (task) => {
    taskDao.create(task);
  };

  onDeleteTask = (task) => {
    taskDao.remove(task);
  };

  onReorderTask = (dragTask, hoverTask) => {
    taskDao.reorder(dragTask, hoverTask);
  };

  render() {
    const {columns, tasks} = this.state;
    const tasksByColumns = _.groupBy(tasks, "column");

    return (
      <div>
        <AddTaskInput onAddTask={this.onAddTask}/>
        <Board>
          {
            _.map(columns, (column) => (
              <Column key={column.id} column={column} onChangeColumn={this.onChangeColumn}>
                {
                  _.map(tasksByColumns[column.id], (task) => (
                    <Task key={task.id}
                          task={task}
                          onDeleteTask={this.onDeleteTask}
                          onReorderTask={this.onReorderTask}
                    />
                  ))
                }
              </Column>
            ))
          }
        </Board>
      </div>
    )
  }

}


