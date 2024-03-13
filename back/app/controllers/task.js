import { Task } from "../models/Task.js";

export async function getAllTasks(req, res) {
  // Récupérer la liste des tâches
  const tasks = []; // TODO !

  // Renvoyer la liste des tâches au format JSON
  res.json(tasks);
}
