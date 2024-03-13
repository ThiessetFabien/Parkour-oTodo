import { Task } from "../models/Task.js";

export async function getAllTasks(req, res) {
  // Récupérer la liste des tâches
  try {
    const tasks = await Task.findAll({
      order: [["created_at", "DESC"]],
    });
    console.log('tasks ', tasks);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected server error. Please try again later." });
  }
  // Renvoyer la liste des tâches au format JSON
}
