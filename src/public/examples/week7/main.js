import { loadSongs } from "./api.js";
import { getFavorites, saveFavorites, songId } from "./storage.js";
import { renderSongs, setFavoriteStyle, updateStatus } from "./render.js";

const grid = document.getElementById("songs-grid");
const statusText = document.getElementById("status");
const favorites = getFavorites();

function toggleFavorite(song, card) {
  const id = songId(song);
  const isFavorite = !favorites.has(id);

  if (isFavorite) favorites.add(id);
  else favorites.delete(id);

  setFavoriteStyle(card, isFavorite);
  saveFavorites(favorites);
  updateStatus(statusText, song, isFavorite);
}

async function init() {
  try {
    const songs = await loadSongs();
    renderSongs(grid, songs, favorites, toggleFavorite);
  } catch (error) {
    grid.innerHTML = "<p>Unable to load songs right now.</p>";
  }
}

init();
