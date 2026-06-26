/* ---------------------------------------------------------
   planner.js — interactive academic task manager
   Demonstrates: arrays & functions, event handling,
   DOM manipulation, dynamic content updates, and an
   interactive task management system with localStorage.
   --------------------------------------------------------- */

(function () {
  "use strict";

  var STORAGE_KEY = "moyo.planner.tasks";

  // The task list is held in an array.
  var tasks = loadTasks();

  // Cache DOM references.
  var form = document.getElementById("task-form");
  var titleInput = document.getElementById("task-title");
  var dueInput = document.getElementById("task-due");
  var priorityInput = document.getElementById("task-priority");
  var listEl = document.getElementById("task-list");
  var emptyState = document.getElementById("empty-state");
  var clearBtn = document.getElementById("clear-completed");

  var statTotal = document.getElementById("stat-total");
  var statActive = document.getElementById("stat-active");
  var statDone = document.getElementById("stat-done");

  /* ---------- Persistence helpers ---------- */
  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : seedTasks();
    } catch (e) {
      return seedTasks();
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      /* storage may be unavailable; the app still works in-memory */
    }
  }

  // A couple of example tasks so the planner isn't empty on first visit.
  function seedTasks() {
    return [
      { id: 1, title: "Finish COS 106 term project", due: "", priority: "high", done: false },
      { id: 2, title: "Review JavaScript DOM notes", due: "", priority: "normal", done: false }
    ];
  }

  /* ---------- Core actions ---------- */
  function addTask(title, due, priority) {
    tasks.push({
      id: Date.now(),
      title: title,
      due: due || "",
      priority: priority || "normal",
      done: false
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      if (t.id === id) {
        t.done = !t.done;
      }
      return t;
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) {
      return !t.done;
    });
    saveTasks();
    render();
  }

  /* ---------- Rendering (DOM manipulation) ---------- */
  function formatDue(due) {
    if (!due) return "";
    var d = new Date(due + "T00:00:00");
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function render() {
    listEl.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }

    tasks.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");

      // checkbox
      var check = document.createElement("input");
      check.type = "checkbox";
      check.className = "task-check";
      check.checked = task.done;
      check.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");
      check.addEventListener("change", function () {
        toggleTask(task.id);
      });

      // main content
      var main = document.createElement("div");
      main.className = "task-main";

      var titleSpan = document.createElement("div");
      titleSpan.className = "task-title";
      titleSpan.textContent = task.title;

      var meta = document.createElement("div");
      meta.className = "task-meta";

      var prioPill = document.createElement("span");
      prioPill.className = "pill " + task.priority;
      prioPill.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + " priority";
      meta.appendChild(prioPill);

      if (task.due) {
        var duePill = document.createElement("span");
        duePill.className = "pill";
        duePill.textContent = "Due " + formatDue(task.due);
        meta.appendChild(duePill);
      }

      main.appendChild(titleSpan);
      main.appendChild(meta);

      // delete button
      var del = document.createElement("button");
      del.type = "button";
      del.className = "task-del";
      del.innerHTML = "&times;";
      del.setAttribute("aria-label", "Delete \"" + task.title + "\"");
      del.addEventListener("click", function () {
        deleteTask(task.id);
      });

      li.appendChild(check);
      li.appendChild(main);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    updateStats();
  }

  function updateStats() {
    var total = tasks.length;
    var done = tasks.filter(function (t) { return t.done; }).length;
    statTotal.textContent = total;
    statDone.textContent = done;
    statActive.textContent = total - done;
  }

  /* ---------- Event handling ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = titleInput.value.trim();
    if (title === "") {
      titleInput.focus();
      return;
    }
    addTask(title, dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = "normal";
    titleInput.focus();
  });

  clearBtn.addEventListener("click", clearCompleted);

  // Initial paint.
  render();
})();
