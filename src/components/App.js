import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {
    todos: null,
    todosLoading: true,
    newTodoName: '',
    somethingIsLoading: false,
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

    let loader = null;
    if (this.state.somethingIsLoading) {
      loader = <div style={{ position: 'absolute', left: 400 }}>Loading...</div>;
    }

    return (
      <div>
        {loader}
        {/* this.state.somethingIsLoading && <div>Loading...</div> */}
        <ul>
          {this.state.todos.map(todo => {
            return (
              <li key={todo.id}>
                <span
                  onClick={() => {
                    this.setState({ somethingIsLoading: true });
                    axios
                      .post('https://dldc-todo-server.herokuapp.com/update', {
                        id: todo.id,
                        done: !todo.done,
                      })
                      .then(() => {
                        axios.get('https://dldc-todo-server.herokuapp.com/').then(response => {
                          this.setState({ todos: response.data, somethingIsLoading: false });
                        });
                      });
                  }}
                >
                  {todo.done ? '✅' : '🔳'} {todo.name}
                </span>
                <button
                  onClick={async () => {
                    this.setState({ somethingIsLoading: true });
                    await axios
                      .post('https://dldc-todo-server.herokuapp.com/delete', {
                        id: todo.id,
                      })
                      .finally(() => {
                        axios.get('https://dldc-todo-server.herokuapp.com/').then(response => {
                          this.setState({ todos: response.data, somethingIsLoading: true });
                        });
                      });
                  }}
                >
                  <span role="img" aria-label="delete">
                    ❌
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <input
          value={this.state.newTodoName}
          onChange={event => {
            this.setState({ newTodoName: event.target.value });
          }}
        />
        <button
          onClick={async () => {
            this.setState({ somethingIsLoading: true });
            const response = await axios.post('https://dldc-todo-server.herokuapp.com/create', {
              name: this.state.newTodoName,
              done: false,
            });
            this.setState({ newTodoName: '', somethingIsLoading: false });
            // await wait(2000);
            const createdTodo = response.data;
            const todosCopy = [...this.state.todos];
            todosCopy.push(createdTodo);
            this.setState({ todos: todosCopy, somethingIsLoading: true });
            await axios.get('https://dldc-todo-server.herokuapp.com/').then(response => {
              this.setState({ todos: response.data, somethingIsLoading: false });
            });
          }}
        >
          Create Todo
        </button>
      </div>
    );
  }

  async componentDidMount() {
    axios.get('https://dldc-todo-server.herokuapp.com/').then(response => {
      this.setState({ todos: response.data, todosLoading: false });
    });
  }
}

export default App;
