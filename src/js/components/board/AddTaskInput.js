import React, {Component, PropTypes} from "react";

export default class AddTaskInput extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onAddTask: PropTypes.func
  };

  onChangeName = (e) => {
    const {onChangeValue} = this.props;
    if (onChangeValue) {
      onChangeValue(e.target.value);
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const {onChangeValue, onAddTask} = this.props;

    if (onAddTask) {
      onAddTask({name : this.state.name});
    }

    if (onChangeValue) {
      onChangeValue("");
    }

  };

  render() {
    const {value} = this.props;
    const submitEnabled = value.length > 0;
    return (
      <form className="task-add" onSubmit={this.onSubmit}>
        <input type="text" value={value} onChange={this.onChangeName}/>
        <button className="btn" type="submit"  disabled={!submitEnabled}>
          <span className="fa fa-plus"/> Create new task
        </button>
      </form>
    )
  }

}
