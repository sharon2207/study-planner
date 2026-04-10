let tasks = [];

// Load saved data
window.onload = function () {
  let saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    displayTasks();
  }
};

// Add task
function addTask() {
  let subject = document.getElementById("subject").value;
  let date = document.getElementById("date").value;
  let difficulty = document.getElementById("difficulty").value;

  if (subject === "" || date === "") {
    alert("Please fill all fields!");
    return;
  }

  tasks.push({
    subject: subject,
    date: date,
    difficulty: parseInt(difficulty),
    progress: 0
  });

  saveData();
  displayTasks();
}

// Save data
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Sort tasks
function sortTasks() {
  tasks.sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    return b.difficulty - a.difficulty;
  });
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  displayTasks();
}

// Countdown
function getDaysLeft(date) {
  let today = new Date();
  let examDate = new Date(date);

  let diff = examDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Update progress
function updateProgress(index, value) {
  tasks[index].progress = value;
  saveData();
  displayTasks();
}

// Display tasks
function displayTasks() {
  sortTasks();

  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let div = document.createElement("div");
    div.className = "task-card";

    let level = ["Easy", "Medium", "Hard"][task.difficulty - 1];
    let daysLeft = getDaysLeft(task.date);

    let warning = daysLeft <= 2 ? "<span class='urgent'>⚠️ Urgent!</span>" : "";

    div.innerHTML = `
      <p>🔥 ${task.subject}</p>
      <p>📅 ${task.date} (${daysLeft} days left)</p>
      <p>${warning}</p>
      <p>⚡ Power: ${level}</p>

      <label>Progress:</label>
      <input type="range" min="0" max="100" value="${task.progress}" 
        onchange="updateProgress(${index}, this.value)">

      <p>${task.progress}% Completed</p>

      <button class="delete-btn" onclick="deleteTask(${index})">❌ Remove</button>
    `;

    list.appendChild(div);
  });

  showPlan();
}

// Show top 3 tasks
function showPlan() {
  let planList = document.getElementById("planList");
  planList.innerHTML = "";

  let topTasks = tasks.slice(0, 3);

  topTasks.forEach(task => {
    let div = document.createElement("div");
    div.className = "task-card plan-card";

    let level = ["Easy", "Medium", "Hard"][task.difficulty - 1];
    let daysLeft = getDaysLeft(task.date);

    div.innerHTML = `
      <p>⚔️ ${task.subject}</p>
      <p>📅 ${task.date} (${daysLeft} days left)</p>
      <p>🔥 Priority: ${level}</p>
    `;

    planList.appendChild(div);
  });
}