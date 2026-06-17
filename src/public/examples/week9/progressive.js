document.documentElement.classList.add("enhanced");

const buttons = [...document.querySelectorAll("[data-filter]")];
const items = [...document.querySelectorAll(".project")];
const count = document.getElementById("count");
const storageKey = "pe-filter";

function applyFilter(type) {
  let visible = 0;
  items.forEach((item) => {
    const match = type === "all" || item.dataset.type === type;
    item.classList.toggle("hidden-by-filter", !match);
    if (match) visible++;
  });
  count.textContent = String(visible);

  buttons.forEach((b) => b.classList.toggle("active", b.dataset.filter === type));
  localStorage.setItem(storageKey, type);
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

applyFilter(localStorage.getItem(storageKey) || "all");