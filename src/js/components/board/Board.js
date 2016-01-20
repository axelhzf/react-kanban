import React, {Component} from "react";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class Board extends Component {

  render() {
    return (
      <div className="board">
        {this.props.children}
      </div>
    )
  }

}

export default DragDropContext(HTML5Backend)(Board);