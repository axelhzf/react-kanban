import React, { PropTypes, Component } from 'react';
import {findDOMNode} from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

class Task extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    onMoveTask: PropTypes.func,
    onDeleteTask: PropTypes.func,
    onReorderTask: PropTypes.func,

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

  componentDidUmount() {
    console.log("unmount task", this.props.task.id);
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget, canDrop } = this.props;
    const { task } = this.props;

    var element;
    if (isDragging) {
      element = <div className="task task-placeholder">Placeholder</div>;
    } else {
      element = (
        <div className="task">

          <div className="task-name">
            {task.name}
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
    const hoverId = props.task.id;

    if (dragId === hoverId) {
      return;
    }

    if (props.onReorderTask) {
      props.onReorderTask(monitor.getItem(), props.task);
    }
  }

};

const collectDrop = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop()
});

const dragSource = {
  beginDrag(props) {
    const {task} = props;
    return task;
  },

  isDragging(props, monitor) {
    return props.task.id === monitor.getItem().id;
  }

};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DropTarget("card", dropSource, collectDrop)(
  DragSource("card", dragSource, collectSource)(Task)
);
