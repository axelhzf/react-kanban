import React, {Component, PropTypes} from "react";

export default class AddTaskInput extends Component {

  static propTypes = {
    onAddTask: PropTypes.func
  };

  state = {
    name: ""
  };

  onChangeName = (e) => {
    this.setState({name : e.target.value});
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.onAddTask) {
      this.props.onAddTask({name : this.state.name});
    }
    this.setState({name : ""});
  };

  render() {
    const {name} = this.state;
    const submitEnabled = name.length > 0;
    return (
      <form className="task-add" onSubmit={this.onSubmit}>
        <input type="text" value={this.state.name} onChange={this.onChangeName}/>
        <button className="btn" type="submit"  disabled={!submitEnabled}>
          <span className="fa fa-plus"/> Create new task
        </button>
      </form>
    )
  }

}
