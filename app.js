const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#empty-list");
const allDelete = document.querySelector("#allDelete");

let tasks = []; //1)Функції:видалення з масива,додавання,і зміна з виконано/не виконано

if (localStorage.getItem("tasks")) {
  tasks /*на старті нашого додатка пустий масив після йде запис у локальное сховище і tasks пушиться в масив*/ =
    JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
// 1
function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;
  // 1)описати наш об'єкт
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false, //зі старту завдання не виконано тому false
  };
  // 2)добавляємо задачу в масив
  tasks.push(newTask);
  saveLocalStorage();
  // console.log(tasks);//бачимо в масиві об'єкт з нашими параметрами ID,text,done
  taskInput.value = "";
  taskInput.focus();

  renderTask(newTask);
  // if (tasksList.children.length > 1) { апдейт в масиві
  //   emptyList.classList.add("none");
  // }
  checkEmptyList();
}

tasksList.addEventListener("click", deleteTask);
// 2
function deleteTask(event) {
  // якшо ми клікнули не по кнопці delete нічого не буде відбуватися
  if (event.target.dataset.action !== "delete") return;

  const perentNode = event.target.closest(".list-group-item");

  // 4)Видаляти ми вже будемо за допомогою нашого створеного ID в addTask
  // console.log(perentNode.id);
  const id = Number(perentNode.id);
  // Видаляємо задачу через фільтрацію масива
  tasks = tasks.filter(function (task) {
    if (task.id === id) {
      //якшо айді співпадає значить він вже є в списку і він не попаде в новий масив
      return false;
    } else {
      return true; // Якщо це новий айді він потрапить у новий масив
    }
  });
  console.log(tasks);
  // рефакторинг
  // tasks = tasks.filter((task) => task.id !== id);
  saveLocalStorage();
  perentNode.remove();

  // if (tasksList.children.length === 1) { апдейт в масиві
  //   //block
  //   emptyList.classList.remove("none");
  // }
  checkEmptyList();
}

tasksList.addEventListener("click", doneTask);
// 3
function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const perentNode = event.target.closest(".list-group-item");
  const id = Number(perentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      //Якщо id рівний галочці вертає true
      return true;
    }
  });
  // рефакторинг
  // const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveLocalStorage();
  const taskTitle = perentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}
// 4 Раніше ми орієнтувались на розмітку блока,зара ми будемо перевіряти якщо в масиві є дані то будемо скривати,якщо немає то ні
function checkEmptyList() {
  if (tasks.length === 0) {
    const blockHTML = `<li class="list-group-item empty-list" id="empty-list">
        <img
          src="https://monomarka.com.ua/wp-content/themes/mono/img/banner-marka.jpg"
          alt="Ukrainian notebook"
        />
        <div class="empty-list__title">Список справ порожній</div>
      </li>`;
    tasksList.insertAdjacentHTML("afterbegin", blockHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#empty-list");
    emptyListEl ? emptyListEl.remove() : null;
  }
}
//5
function saveLocalStorage() {
  //збереження нашого масива в Application - localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title"; // умова ? if true : if false
  // console.log(cssClass);//3)Формуємо Css класс
  const taskHTML = `<li id="${task.id}" class="list-group-item task-item d-flex justify-content-between">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
      <button  class="btn-action" type="button" data-action="done">
          <img src="./img/tick.svg" alt="tick-done">
      </button>
      <button  class="btn-action" type="button" data-action="delete">
          <img src="./img/cross.svg" alt="cross-delete">
      </button>
  </div>
</li>`;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
