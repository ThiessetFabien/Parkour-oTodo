import { apiBaseUrl } from "./config.js";

export async function fetchAndInsertTasks() {
  // Récupérer les listes via l'API à l'aide de la fonction `fetch()`
  const response = await fetch(`${apiBaseUrl}/tasks`);
  const tasks = await response.json();

  if (!response.ok) {
    throw new Error("Une erreur est survenue");
  }

  // Boucler sur la liste des tâches
  tasks.forEach((task) => {
    // Pour chaque tâche, l'insérer dans la page à l'aide de la fonction `insertTaskInHTML()`
    insertTaskInHTML(task);
  });
}

/**
 * Insert une tâche dans le DOM
 * @param {Object} taskData - L'objet représentant la tâche
 * @param {number} taskData.id - L'id de la tâche
 * @param {string} taskData.name - Le nom de la tâche
 * @example insertTaskInHTML({ id: 1, name: "Faire les courses"}); // Affiche une tâche dans la page
 */
export function insertTaskInHTML(taskData) {
  // On récupère le HTML d'une tâche dans le template
  const taskTemplate = document.querySelector(".template-task");
  const newTask = document.importNode(taskTemplate.content, true);

  // On insère les données de la tâche dans le HTML
  newTask.querySelector(".task__name").textContent = taskData.name;
  newTask.querySelector(".task__input-name").value = taskData.name;
  newTask.querySelector(".task__input-id").value = taskData.id;
  newTask.querySelector(".task").dataset.id = taskData.id;

  // On écoute les événements sur les éléments créés
  newTask
    .querySelector(".task__delete")
    .addEventListener("click", handleDeleteButton);

  newTask
    .querySelector(".task__edit")
    .addEventListener("click", handleEditButton);

  newTask
    .querySelector(".task__edit-form")
    .addEventListener("submit", handleEditForm);

  // On insère le HTML de la tâche dans la page
  document.querySelector(".tasks").append(newTask);

  console.log("form ");
  document.getElementById("create-task").reset();
}

export async function handleCreateForm(event) {
  // Bloquer l'envoie du formulaire
  event.preventDefault();

  // Récupérer les données du formulaire
  const taskFormData = Object.fromEntries(new FormData(event.currentTarget));
  console.log(taskFormData);

  // Envoyer les données à l'API
  const httpResponse = await fetch(`${apiBaseUrl}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskFormData),
  });

  const createdTask = await httpResponse.json();
  // Après confirmation de l'API insérer la tâche dans la page (il y a une fonction toute prete pour ça ;)
  // en utilisant la valeur de retour de l'API
  insertTaskInHTML(createdTask);
}

async function handleDeleteButton(event) {
  // On récupère l'ID de l'élément à supprimer
  const taskHtmlElement = event.currentTarget.closest(".task");
  const taskId = parseInt(taskHtmlElement.dataset.id);
  console.log(taskId);

  // On envoie la requete de suppression à l'API
  try {
    const httpResponse = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
      method: "DELETE",
    });
    // On supprime l'élément dans la page HTML
    document.querySelector(`.tasks [data-id="${taskId}"]`).remove();
    return httpResponse.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function handleEditButton(event) {
  // On récupére l'élément HTML de la tâche à modifier
  const taskHtmlElement = event.currentTarget.closest(".task");
  // On affiche l'input de modification
  taskHtmlElement.querySelector(".task__edit-form").style.display = "flex";
  // On masque le titre
  taskHtmlElement.querySelector(".task__name").style.display = "none";
}

async function handleEditForm(event) {
  try {
    // Bloquer l'envoie du formulaire
    event.preventDefault();

    // On récupère l'élément HTML complet de la tâche à modifier
    const taskHtmlElement = event.currentTarget.closest(".task");

    // Récupérer les données du formulaire
    const editTaskFormData = new FormData(event.currentTarget);

    console.log("name", editTaskFormData.get("name")); // Le nouveau nom récupéré
    const tagName = editTaskFormData.get("name");
    console.log("id", editTaskFormData.get("id")); // L'ID de la tâche à modifier
    const taskId = editTaskFormData.get("id");

    // Envoyer les données à l'API
    const httpResponse = await fetch(`${apiBaseUrl}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tagName,
        id: taskId,
      }),
    });
    if (!httpResponse.ok) {
      throw new Error("Une erreur est survenue");
    }

    const updateTask = await httpResponse.json();
    console.log("updateTask ", updateTask);
    // Après confirmation de l'API modifier le nom de la tâche dans le span.task__name
    taskHtmlElement.querySelector(".task__name").textContent = tagName;
    // On affiche l'input de modification
    taskHtmlElement.querySelector(".task__edit-form").style.display = "none";
    // On masque le titre
    taskHtmlElement.querySelector(".task__name").style.display = "block";
  } catch (error) {
    console.error(error);
  }
}
