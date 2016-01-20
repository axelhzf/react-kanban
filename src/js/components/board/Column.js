import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';

class Column extends Component {

  static propTypes = {
    column: PropTypes.object.isRequired,

    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };

  render() {
    const { canDrop, isOver, connectDropTarget, column, children } = this.props;
    const isActive = canDrop && isOver;

    let dropZoneClass = "drop-zone";
    if (isActive) dropZoneClass += " active";
    if (canDrop) dropZoneClass += " canDrop";

    return (
      <div className="column">
        <div className="column-info">
          {column.name}
        </div>
        <div className="column-content">
          {children}
        </div>
        {connectDropTarget(<div className={dropZoneClass}>
          {isActive ? 'Release to drop' : 'Drag a task here'}
        </div>)}
      </div>
    )
  }

}

const boxTarget = {
  drop(props) {
    const {column} = props;
    return column;
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export default DropTarget("card", boxTarget, collect)(Column);