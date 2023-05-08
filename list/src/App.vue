<template>
  <div>
    <!-- Todo list title -->
    <h1>Todo List</h1>
    
    <!-- Add new todo form -->
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add a new task" />
      <button>Add</button>
    </form>
    
    <!-- Display list of todos -->
    <ul>
      <li v-for="(todo) in todos" :key="todo.id">
        <!-- Todo item with checkbox, text and buttons -->
        <div>
          <!-- Checkbox to mark as completed -->
          <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
          
          <!-- Display todo text with a strike-through if completed -->
          <span :class="{ 'completed': todo.completed }" v-if="!todo.editing">{{ todo.text }}</span>
          
          <!-- Editable input field to modify the todo text -->
          <input type="text" v-model="todo.text" v-else @blur="updateTodo(todo)" />
          
          <!-- Buttons to edit, save, or delete the todo item -->
          <div class="buttons">
            <button v-if="!todo.editing" @click="todo.editing = true" class="edit-btn">Edit</button>
            <button v-else @click="todo.editing = false" class="save-btn">Save</button>
            <button @click="removeTodo(todo)" class="delete-btn">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [],
      newTodo: "",
    };
  },
  methods: {
    async addTodo() {
      // add a new todo to the list
      if (this.newTodo.trim()) {
        const response = await fetch("http://localhost:3000/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: this.newTodo.trim(),
            completed: false,
          }),
        });
        if (response.ok) {
          const todo = await response.json();
          this.todos.push(todo);
          this.newTodo = "";
        }
      }
    },
    async removeTodo(todo) {
      // remove a todo from the list
      const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        this.todos = this.todos.filter((t) => t.id !== todo.id);
      }
    },
    async updateTodo(todo) {
      // update a todo in the list
      if (!todo.text.trim()) {
        return;
      }
      const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: todo.text.trim(),
          completed: todo.completed,
        }),
      });
      if (response.ok) {
        todo.editing = false;
      } else {
        console.error("Failed to update todo:", todo);
      }
    },
    async getTodos() {
      // retrieve the list of todos from the server
      const response = await fetch("http://localhost:3000/todos");
      if (response.ok) {
        this.todos = await response.json();
      }
    },
  },
  created() {
    // initialize the component by loading the todos from the server
    this.getTodos();
  },
};
</script>


<style scoped>
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  form, li {
    font-size: 14px;
  }

  form input {
    width: 60%;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  form button {
    background-color: #4754e0;
    color: white;
  }

  button {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 14px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  li input[type="checkbox"] {
    margin-right: 1rem;
  }

  .edit-btn,
  .save-btn {
    background-color: white;
    color: #4754e0;
    border: 1px solid #4754e0;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: 0.1s;
  }

  .edit-btn:hover,
  .save-btn:hover {
    background-color: #4754e0;
    color: white;
  }

  .delete-btn {
    background-color: white;
    border: 1px solid #f23d3d;
    color: #f23d3d;
  }

  .delete-btn:hover {
    background-color: #f23d3d;
    color: white;
  }

  .completed {
    text-decoration: line-through;
  }

  li div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .buttons {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    width: 40%;
  }

  li div input[type="text"] {
    flex: 1;
    margin-left: 10px;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  span {
    width: max-content;
  }
</style>

