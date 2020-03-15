import React from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = React.useState(null);
  const [todosLoading, setTodosLoading] = React.useState(true);
  const [newTodoName, setNewTodoName] = React.useState("");
  const [somethingIsLoading, setSomethingIsLoading] = React.useState(false);

  React.useEffect(() => {
    axios.get("https://dldc-todo-server.herokuapp.com/").then(response => {
      setTodos(response.data);
      setTodosLoading(false);
    });
  }, []);

  if (todosLoading === true) {
    return <div>Fetching todos...</div>;
  }
  if (todos === null) {
    return (
      <div>
        <p>Todos not loaded !</p>
      </div>
    );
  }

  let loader = null;
  if (somethingIsLoading) {
    loader = <div style={{ position: "absolute", left: 400 }}>Loading...</div>;
  }

  return (
    <div>
      {loader}
      {/* somethingIsLoading && <div>Loading...</div> */}
      <ul>
        {todos.map(todo => {
          return (
            <li key={todo.id}>
              <span
                onClick={() => {
                  setSomethingIsLoading(true);
                  axios
                    .post("https://dldc-todo-server.herokuapp.com/update", {
                      id: todo.id,
                      done: !todo.done
                    })
                    .then(() => {
                      axios
                        .get("https://dldc-todo-server.herokuapp.com/")
                        .then(response => {
                          setTodos(response.data);
                          setSomethingIsLoading(false);
                        });
                    });
                }}
              >
                {todo.done ? "✅" : "🔳"} {todo.name}
              </span>
              <button
                onClick={async () => {
                  setSomethingIsLoading(true);
                  await axios
                    .post("https://dldc-todo-server.herokuapp.com/delete", {
                      id: todo.id
                    })
                    .finally(() => {
                      axios
                        .get("https://dldc-todo-server.herokuapp.com/")
                        .then(response => {
                          setTodos(response.data);
                          setSomethingIsLoading(true);
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
        value={newTodoName}
        onChange={event => {
          setNewTodoName(event.target.value);
        }}
      />
      <button
        onClick={async () => {
          setSomethingIsLoading(true);
          const response = await axios.post(
            "https://dldc-todo-server.herokuapp.com/create",
            {
              name: newTodoName,
              done: false
            }
          );
          setNewTodoName("");
          setSomethingIsLoading(false);
          // await wait(2000);
          const createdTodo = response.data;
          const todosCopy = [...todos];
          todosCopy.push(createdTodo);
          setTodos(todosCopy);
          setSomethingIsLoading(true);
          await axios
            .get("https://dldc-todo-server.herokuapp.com/")
            .then(response => {
              setTodos(response.data);
              setSomethingIsLoading(false);
            });
        }}
      >
        Create Todo
      </button>
    </div>
  );
};

export default App;
