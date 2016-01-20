import React from "react";
import _ from "lodash";
import {connect} from "react-redux";

import Board from "../components/board/Board";
import Column from "../components/board/Column";
import Task from "../components/board/Task";
import AddTaskInput from "../components/board/AddTaskInput";

class BoardPage extends React.Component {

  render() {
    const {
      columns, tasks,
      onCreateTask, onDeleteTask,
      onMoveTaskToColumn, onMoveTaskNextToTask
      } = this.props;

    const tasksByColumns = _.groupBy(tasks, "column");

    return (
      <div>
        <AddTaskInput onAddTask={onCreateTask}/>
        <Board>
          {
            _.map(columns, (column) => (
              <Column key={column.id} column={column} onMoveTaskToColumn={onMoveTaskToColumn} >
                {
                  _.map(tasksByColumns[column.id], (task) => (
                    <Task key={task.id}
                          task={task}
                          onDeleteTask={onDeleteTask}
                          onMoveTaskNextToTask={onMoveTaskNextToTask}
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

const mapStateToProps = (state) => {
  return {
    columns: state.columns,
    tasks: state.tasks
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateTask: (task) => {
      dispatch({type: "CREATE_TASK", task})
    },
    onDeleteTask: (task) => {
      dispatch({type: "DELETE_TASK", task})
    },
    onMoveTaskToColumn: (task, column) => {
      dispatch({type: "MOVE_TASK_TO_COLUMN", task, column})
    },
    onMoveTaskNextToTask: (fromTask, toTask) => {
      dispatch({type: "MOVE_TASK_NEXT_TO_TASK", fromTask, toTask: toTask})
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
