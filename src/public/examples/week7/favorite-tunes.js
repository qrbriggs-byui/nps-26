const STORAGE_KEY = "favorite-rock-songs";
const grid = document.getElementById("songs-grid");
const statusText = document.getElementById("status");

const songId = (song) => `${song.title}|${song.artist}`;

function getFavorites() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return new Set(saved ? JSON.parse(saved) : []);
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

function setFavoriteStyle(card, isFavorite) {
  card.classList.toggle("is-favorite", isFavorite);
  card.setAttribute("aria-pressed", isFavorite ? "true" : "false");
}

function updateStatus(song, isFavorite) {
  statusText.textContent = isFavorite
    ? `Added: ${song.title} by ${song.artist}`
    : `Removed: ${song.title} by ${song.artist}`;
}

function toggleFavorite(song, card, favorites) {
  const id = songId(song);
  const isFavorite = !favorites.has(id);

  if (isFavorite) favorites.add(id);
  else favorites.delete(id);

  setFavoriteStyle(card, isFavorite);
  saveFavorites(favorites);
  updateStatus(song, isFavorite);
}

function createSongCard(song, favorites) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "song-card";
  card.innerHTML = `
    <span class="song-title">${song.title}</span>
    <p class="song-meta"><strong>Artist:</strong> ${song.artist}</p>
    <p class="song-meta"><strong>Year:</strong> ${song.yearReleased}</p>
    <p class="song-meta"><strong>Album:</strong> ${song.album}</p>
  `;

  setFavoriteStyle(card, favorites.has(songId(song)));
  card.addEventListener("click", () => toggleFavorite(song, card, favorites));
  return card;
}

function renderSongs(songs, favorites) {
  const cards = songs.map((song) => createSongCard(song, favorites));
  grid.replaceChildren(...cards);
}

async function loadSongs() {
  const response = await fetch("./80s-rock.json");
  if (!response.ok) throw new Error("Could not load songs.");
  return response.json();
}

async function init() {
  try {
    const songs = await loadSongs();
    renderSongs(songs, getFavorites());
  } catch (error) {
    grid.innerHTML = "<p>Unable to load songs right now.</p>";
  }
}

init();
