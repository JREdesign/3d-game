// index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js"; // Make sure to have the correct file name
import { questionsRouter } from "./routes/questions.js"; // Make sure to have the correct file name

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/questions", questionsRouter); // Updated from /recipes to /questions

mongoose.connect(
  // Make sure your connection string is correct and secured
  "mongodb+srv://root:1234567890A@superquiztv.ssafxiv.mongodb.net/superquiztv?retryWrites=true&w=majority&appName=superquiztv"
)
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("Could not connect to MongoDB:", err));

const PORT = 3001; // Define a variable for port if you want to reuse it or configure it easily
app.listen(PORT, () => console.log(`SERVER STARTED on port ${PORT}!`)); // Using template literals for the port number
