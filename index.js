import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import TodoModel from "./TodoSchema/todoSchema.js";
const app = express();

dotenv.config();
app.use(cors());

const port = process.env.PORT || 9000;
const url = process.env.DB_URL;
app.use(express.json());
// connection methode to Database
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // If database is connected successfully
    console.log("Database connected successfully.........");
  })
  .catch((error) => {
    // If an error occurs
    console.log(error);
  });

// home route
app.get("/", (req, res) => {
  res.send("Welcome to Cletus Todo API");
});

// Get all todo route
app.get("/getAllTodos", async (req, res) => {
  const todo = await TodoModel.find({});

  if (todo) {
    return res.status(200).json({
      message: "Fetch all todos from database",
      data: todo,
    });
  } else {
    res.status(400).json({
      message: "Faild tofetch todos from database",
    });
  }
});
///Create a new todo into database
app.post("/createtodo", async (req, res) => {
  const { title, description, isCompleted } = req.body;
  const createTodo = await TodoModel.create({
    title,
    description,
    isCompleted,
  });
  if (createTodo) {
    return res.status(201).json({
      message: "Todo created successfully",
      data: createTodo,
    });
  } else {
    return res.status(204).json({
      message: "Failed to create a new Todo",
    });
  }
});

// update:
app.patch("/updateTodos/:id", async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;
  const updateTodo = await TodoModel.updateOne({
    isCompleted: isCompleted,
  }).where({ _id: id });

  if (updateTodo) {
    return res.status(200).json({
      message: "Todo updated successfully",
      data: updateTodo,
    });
  } else {
    return res.status(400).json({
      message: "Faild to update todo",
    });
  }
});

// Delete todo from Database
app.delete("/deleteTodo/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await TodoModel.findByIdAndDelete({ _id: id });
  if (deleteTodo) {
    return res.status(200).json({
      message: "Todo deleted successully...",
    });
  } else {
    return res.status(400).json({});
  }
});

app.listen(port, () => {
  console.log(`Todo server running at ${port}`);
});
// 301013018
