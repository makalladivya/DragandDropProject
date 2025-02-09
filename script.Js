let draggedBox = null;
let sourceCell = null;

const tableBody = document.querySelector("table tbody");
const addRowBtn = document.getElementById("addRowBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

let actionStack = [];
let redoStack = [];
let boxNumber = 900;
const colors = [
  "#75ff33", "#3357ff", "#ff8f33", "#ffd433", "#33f0ff",
  "#a133ff", "#ff33a1", "#3357ff", "#ff5733"
];

// Function to add a new row
function addRow() {
  const row = document.createElement("tr");

  for (let i = 0; i < 3; i++) {
    const cell = document.createElement("td");
    const box = document.createElement("div");
    boxNumber += 100;
    box.className = "box";
    box.draggable = true;
    box.id = `box${boxNumber / 100}`;
    box.style.backgroundColor = colors[(boxNumber / 100) % colors.length];
    box.textContent = boxNumber;

    attachDragEvents(box);
    cell.appendChild(box);
    row.appendChild(cell);
  }

  tableBody.appendChild(row);
  actionStack.push({ type: "addRow", row });
  redoStack = []; // Clear redo stack after new action
}

// Function to swap boxes correctly
function swapBoxes(box1, box2, isRedo = false) {
  if (!box1 || !box2 || box1 === box2) return;

  const parent1 = box1.parentElement;
  const parent2 = box2.parentElement;

  if (parent1 && parent2) {
    parent1.appendChild(box2);
    parent2.appendChild(box1);
  }

  if (!isRedo) {
    actionStack.push({ type: "swap", box1, box2 });
    redoStack = []; // Clear redo stack after new action
  }
}

// Function to undo last action
function undo() {
  if (actionStack.length === 0) return;

  const lastAction = actionStack.pop();
  redoStack.push(lastAction);

  if (lastAction.type === "addRow") {
    tableBody.removeChild(lastAction.row);
  } else if (lastAction.type === "swap") {
    swapBoxes(lastAction.box1, lastAction.box2, true);
  }
}

// Function to redo last undone action
function redo() {
  if (redoStack.length === 0) return;

  const lastUndone = redoStack.pop();
  actionStack.push(lastUndone);

  if (lastUndone.type === "addRow") {
    tableBody.appendChild(lastUndone.row);
  } else if (lastUndone.type === "swap") {
    swapBoxes(lastUndone.box2, lastUndone.box1, true);
  }
}

// Drag-and-Drop Handlers
function handleDragStart(event) {
  draggedBox = event.target;
  sourceCell = draggedBox.parentElement;
  event.target.style.opacity = "0.5";
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  if (!draggedBox) return;

  const targetBox = event.target.closest(".box");
  if (targetBox) {
    swapBoxes(draggedBox, targetBox);
  }

  draggedBox.style.opacity = "1";
  draggedBox = null;
}

// Attach event listeners to boxes
function attachDragEvents(box) {
  box.addEventListener("dragstart", handleDragStart);
  box.addEventListener("dragover", handleDragOver);
  box.addEventListener("drop", handleDrop);
}

// Attach events to all initial boxes
document.querySelectorAll(".box").forEach(attachDragEvents);

// Button Event Listeners
addRowBtn.addEventListener("click", addRow);
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
