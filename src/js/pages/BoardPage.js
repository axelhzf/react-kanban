import React, {PropTypes} from "react";
import _ from "lodash";
import {connect} from "react-redux";
import IPropTypes from "immutable-props";

import Board from "../components/board/Board";
import Column from "../components/board/Column";
import Task from "../components/board/Task";
import AddTaskInput from "../components/board/AddTaskInput";

class BoardPage extends React.Component {

  static propTypes = {
    columns: IPropTypes.List.isRequired,
    tasks: IPropTypes.List.isRequired,

    onCreateTask: PropTypes.func,
    onDeleteTask: PropTypes.func,
    onMoveTaskToColumn: PropTypes.func,
    onMoveTaskNextToTask: PropTypes.func
  };

  renderTasks(tasks) {
    if (!tasks) return;

    const {onDeleteTask, onMoveTaskNextToTask} = this.props;

    return tasks.map(task => (
      <Task key={task.get("id")}
            task={task}
            onDeleteTask={onDeleteTask}
            onMoveTaskNextToTask={onMoveTaskNextToTask}
      />
    ));
  }

  render() {
    const {
      columns, tasks, newTaskName,
      onCreateTask, onMoveTaskToColumn, onNewTaskNameChange
      } = this.props;

    const tasksByColumns = tasks.groupBy((task) => task.get("column"));

    return (
      <div>
        <AddTaskInput onAddTask={onCreateTask} value={newTaskName} onChangeValue={onNewTaskNameChange}/>
        <Board>
          {
            columns.map(column => (
              <Column key={column.get("id")} column={column} onMoveTaskToColumn={onMoveTaskToColumn}>
                { this.renderTasks(tasksByColumns.get(column.get("id"))) }
              </Column>
            ))
          }
        </Board>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    columns: state.get("columns"),
    tasks: state.get("tasks"),
    newTaskName: state.get("newTaskName")
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateTask: (task) => {
      dispatch({type: "CREATE_TASK", task});
    },
    onDeleteTask: (task) => {
      dispatch({type: "DELETE_TASK", task});
    },
    onMoveTaskToColumn: (task, column) => {
      dispatch({type: "MOVE_TASK_TO_COLUMN", task, column});
    },
    onMoveTaskNextToTask: (fromTask, toTask) => {
      dispatch({type: "MOVE_TASK_NEXT_TO_TASK", fromTask, toTask: toTask});
    },
    onNewTaskNameChange: (name) => {
      dispatch({type: "NEW_TASK_NAME_CHANGE", name});
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
