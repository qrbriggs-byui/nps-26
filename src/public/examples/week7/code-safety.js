const DATA_URL = "./80s-rock.json";
let initialized = false;

function init() {
  // Top-level init guard: prevents the page from running the setup more than once
  // if init() is triggered again by mistake.
  if (initialized) return;
  initialized = true;

  const statusEl = document.querySelector("#status");
  const cardContainer = document.querySelector("#cardContainer");

  // DOM null checks: make sure the elements exist before trying to use them.
  // If a selector fails, the code stops safely instead of causing an error.
  if (!statusEl || !cardContainer) {
    return;
  }

  loadSongs(statusEl, cardContainer);
}

async function loadSongs(statusEl, cardContainer) {
  try {
    const response = await fetch(DATA_URL);

    // response.ok checks: confirm the request worked before reading the data.
    // This catches problems like 404 or 500 responses.
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const text = await response.text();

    // try/catch with parsing: JSON.parse can fail if the file is not valid JSON.
    // The catch block handles that failure without crashing the page.
    const data = JSON.parse(text);

    // Array guards: make sure the parsed data is actually an array before
    // using array methods like map().
    if (!Array.isArray(data)) {
      throw new Error("Unexpected data format.");
    }

    renderCards(data, cardContainer);
    statusEl.textContent = `Loaded ${data.length} songs safely.`;
  } catch (error) {
    statusEl.textContent = "Unable to load songs.";
    cardContainer.innerHTML = `<p class="status">Error: ${error.message}</p>`;
  }
}

function renderCards(items, container) {
  container.innerHTML = items
    .map((item) => {
      // Optional chaining: safely access properties even if item is missing.
      // Nullish coalescing: use a default only when the value is null or undefined.
      const title = item?.title;
      const artist = item?.artist ?? "Unknown artist";
      const yearReleased = item?.yearReleased ?? "Unknown year";
      const album = item?.album ?? "Unknown album";

      return `
        <article class="card">
          <h3>${title}</h3>
          <p><strong>Artist:</strong> ${artist}</p>
          <p><strong>Year:</strong> ${yearReleased}</p>
          <p class="meta"><strong>Album:</strong> ${album}</p>
        </article>
      `;
    })
    .join("");
}

// If "defer" is not used on the script tag, this ensures init() runs only after the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", init);