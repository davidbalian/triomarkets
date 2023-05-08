const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

let todos = [
  { id: 1, text: "Learn Vue.js", completed: false },
  { id: 2, text: "Build a todo list", completed: false },
  { id: 3, text: "Deploy to production", completed: false },
];
let nextId = 4;

app.use(express.json());
app.use(cors());

// get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// create a new todo
app.post("/todos", (req, res) => {
  const { text, completed } = req.body;
  const todo = { id: nextId++, text, completed };
  todos.push(todo);
  res.json(todo);
});

// update a todo
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index].text = text;
    todos[index].completed = completed;
    res.json(todos[index]);
  } else {
    res.status(404).send("Todo not found");
  }
});

// delete a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    const todo = todos[index];
    todos.splice(index, 1);
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
