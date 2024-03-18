// questions.js:
import express from "express";
import { QuestionModel } from "../models/Questions.js";

const router = express.Router();

// Endpoint para obtener todas las preguntas
router.get("/", async (req, res) => {
  try {
    const questions = await QuestionModel.find({});
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para crear una nueva pregunta
router.post("/", async (req, res) => {
  const { text, options } = req.body;
  const question = new QuestionModel({
    text,
    options,
  });

  try {
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener una pregunta especÃ­fica por su ID
router.get("/:questionId", async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para actualizar una pregunta por su ID
router.patch("/:questionId", async (req, res) => {
  try {
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para eliminar una pregunta por su ID
router.delete("/:questionId", async (req, res) => {
  try {
    const deletedQuestion = await QuestionModel.findByIdAndDelete(
      req.params.questionId
    );
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router as questionsRouter };
