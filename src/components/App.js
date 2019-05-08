import React from 'react';
import axios from 'axios';

const wait = time => {
  return new Promise(resolve => {
    window.setTimeout(resolve, time);
  });
};

class App extends React.Component {
  state = {
    todos: null,
    todosLoading: true,
  };

  render() {
    if (this.state.todosLoading === true) {
      return <div>Fetching todos...</div>;
    }
    if (this.state.todos === null) {
      return (
        <div>
          <p>Todos not loaded !</p>
        </div>
      );
    }
    return (
      <div>
        <ul>
          {this.state.todos.map(todo => {
            return (
              <li key={todo.id}>
                {todo.done ? '✅' : '❎'} {todo.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  async componentDidMount() {
    await wait(2000);
    axios.get('https://dldc-todo-server.herokuapp.com/').then(response => {
      this.setState({ todos: response.data, todosLoading: false });
    });
  }
}

export default App;
