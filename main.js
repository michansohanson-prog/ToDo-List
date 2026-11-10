const foodInput = document.querySelector("#food-input");
const foodButt = document.querySelector("#food-butt");
const foodList = document.querySelector(".food-list");

const nonInput = document.querySelector("#non-input");
const nonButt = document.querySelector("#non-butt");
const nonList = document.querySelector(".non-list");

const removeBtn = document.querySelector("#remove");

// 1. LOAD SAVED ITEMS WHEN THE PAGE OPENS
document.addEventListener("DOMContentLoaded", () => {
  loadSavedLists();
});

// Remove checked items
removeBtn.addEventListener("click", () => {
  const selectedEntries = document.querySelectorAll(".selected-food");
  selectedEntries.forEach((entry) => {
    entry.remove();
  });
  saveListsToStorage(); // Save changes after removing
});

foodButt.addEventListener("click", (e) => {
  if (!foodInput.value.trim()) return;

  createEntry(foodInput.value, false, foodList);

  foodInput.value = "";
  nonInput.value = "";
  saveListsToStorage(); // Save changes after adding
});

nonButt.addEventListener("click", (e) => {
  if (!nonInput.value.trim()) return;

  createEntry(nonInput.value, false, nonList);

  nonInput.value = "";
  foodInput.value = "";
  saveListsToStorage(); // Save changes after adding
});

// --- HELPER FUNCTIONS FOR LOCALSTORAGE ---

// Function to create and append an entry (reused by both adding and loading)
function createEntry(text, isChecked, targetList) {
  const newFoodEntry = document.createElement("p");

  const newFoodText = document.createElement("span");
  newFoodText.textContent = text;
  newFoodText.style.marginLeft = "10px";

  const newFoodCheckbox = document.createElement("input");
  newFoodCheckbox.type = "checkbox";
  newFoodCheckbox.checked = isChecked;

  // If it was loaded as checked, give it the style right away
  if (isChecked) {
    newFoodEntry.classList.add("selected-food");
  }

  newFoodCheckbox.addEventListener("change", () => {
    newFoodEntry.classList.toggle("selected-food", newFoodCheckbox.checked);
    saveListsToStorage(); // Save state if a checkbox is toggled
  });

  newFoodEntry.appendChild(newFoodCheckbox);
  newFoodEntry.appendChild(newFoodText);
  targetList.appendChild(newFoodEntry);
}

// Function to gather all items from both lists and save to browser
function saveListsToStorage() {
  const foodData = [];
  // Loop through all items currently in the food list
  foodList.querySelectorAll("p").forEach((p) => {
    foodData.push({
      text: p.querySelector("span").textContent,
      checked: p.querySelector("input").checked,
    });
  });

  const nonData = [];
  // Loop through all items currently in the non-food list
  nonList.querySelectorAll("p").forEach((p) => {
    nonData.push({
      text: p.querySelector("span").textContent,
      checked: p.querySelector("input").checked,
    });
  });

  // Save them into localStorage as text strings
  localStorage.setItem("foodListItems", JSON.stringify(foodData));
  localStorage.setItem("nonListItems", JSON.stringify(nonData));
}

// Function to read from localStorage and rebuild the HTML lists on startup
function loadSavedLists() {
  const savedFood = JSON.parse(localStorage.getItem("foodListItems"));
  const savedNon = JSON.parse(localStorage.getItem("nonListItems"));

  if (savedFood) {
    savedFood.forEach((item) => {
      createEntry(item.text, item.checked, foodList);
    });
  }

  if (savedNon) {
    savedNon.forEach((item) => {
      createEntry(item.text, item.checked, nonList);
    });
  }
}
