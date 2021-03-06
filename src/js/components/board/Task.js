import React, { PropTypes, Component } from 'react';
import {findDOMNode} from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import IPropTypes from "immutable-props";

class Task extends Component {

  static propTypes = {
    task: IPropTypes.Map.isRequired,

    onMoveTask: PropTypes.func,
    onDeleteTask: PropTypes.func,
    onMoveTaskNextToTask: PropTypes.func,

    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  onDelete = (e) => {
    e.preventDefault();

    const { task, onDeleteTask } = this.props;
    if (onDeleteTask) {
      onDeleteTask(task);
    }
  };

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const { task } = this.props;

    var element;
    if (isDragging) {
      element = <div className="task task-placeholder">Placeholder</div>;
    } else {
      element = (
        <div className="task">

          <div className="task-name">
            {task.get("name")}
          </div>

          <div className="task-actions">

            <a href="" className="task-delete" onClick={this.onDelete}>
              <span className="fa fa-minus-circle"/>
            </a>

          </div>

        </div>
      )
    }


    return (
      connectDropTarget(connectDragSource(element))
    )
  }

}

const dropSource = {

  hover(props, monitor) {
    const dragId = monitor.getItem().id;
    const hoverId = props.task.get("id");
    
    if (dragId === hoverId) {
      return;
    }

    if (props.onMoveTaskNextToTask) {
      props.onMoveTaskNextToTask(monitor.getItem(), props.task);
    }
  }

};

const collectDrop = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

const dragSource = {

  beginDrag(props) {
    const {task} = props;
    return task.toJS();
  },

  isDragging(props, monitor) {
    return props.task.get("id") === monitor.getItem().id;
  }

};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DropTarget("card", dropSource, collectDrop)(
  DragSource("card", dragSource, collectSource)(Task)
);
