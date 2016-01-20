import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';

class Task extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    onMoveTask: PropTypes.func,
    onDeleteTask: PropTypes.func,

    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  onDelete = (e) => {
    const { task, onDeleteTask } = this.props;
    if (onDeleteTask) {
      onDeleteTask(task);
    }
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { task } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div className="task" style={{opacity}}>
          {task.name}
          <button className="btn" onClick={this.onDelete}>Delete</button>
        </div>
      )
    )
  }

}

const boxSource = {
  beginDrag(props) {
    const {task} = props;
    return task;
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult && props.onMoveTask) {
      props.onMoveTask(item, dropResult);
    }

  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource("card", boxSource, collect)(Task);