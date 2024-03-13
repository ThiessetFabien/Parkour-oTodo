import { Router } from "express";
import * as taskController from "./controllers/task.js";

export const router = Router();

// Route pour la liste des taches
router.get("/tasks", taskController.getAllTasks);

// Route pour ajouter une tache

// Route pour modifier une tache

// Route pour supprimer une tache

