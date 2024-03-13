import { Task } from "../models/Task.js";

export async function getAllTasks(_, res) {
  // Récupérer la liste des tâches
  try {
    const tasks = await Task.findAll();
    // Renvoyer la liste des tâches au format JSON
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected server error. Please try again later." });
  }
}

export async function insertTasks(req, res) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      const error = name
        ? "Invalid type: 'name' must be a string."
        : "Missing body parameter: 'title'.";
      return res.status(400).json({ error });
    }

    const createTask = await Task.create({ name });
    res.status(400).json(createTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected server error. Please try again later." });
  }
}
