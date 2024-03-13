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
      return res.status(400).json({ error: `${error}` });
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

export async function updateTask(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Task ID must be valide integer" });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string") {
      const error = name
        ? "Invalid type: 'name' must be a string."
        : "Missing body parameter: 'title'.";
      return res.status(400).json({ error: `${error}` });
    }

    const updateTask = await Task.update({ name: name }, { where: { id: id } });

    if (updateTask === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(202).json(updateTask);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected server error. Please try again later." });
  }
}

export async function deleteTask(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Task ID must be valide integer" });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res
        .status(404)
        .json({ error: "List not found. Please verify the provided ID." });
    }

    await Task.destroy();
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unexpected server error. Please try again later." });
  }
}
