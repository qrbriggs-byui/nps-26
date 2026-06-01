import { songId } from "./storage.js";

export function setFavoriteStyle(card, isFavorite) {
  card.classList.toggle("is-favorite", isFavorite);
  card.setAttribute("aria-pressed", isFavorite ? "true" : "false");
}

export function updateStatus(statusText, song, isFavorite) {
  statusText.textContent = isFavorite
    ? `Added: ${song.title} by ${song.artist}`
    : `Removed: ${song.title} by ${song.artist}`;
}

export function createSongCard(song, favorites, onToggle) {
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
  card.addEventListener("click", () => onToggle(song, card));
  return card;
}

export function renderSongs(grid, songs, favorites, onToggle) {
  const cards = songs.map((song) => createSongCard(song, favorites, onToggle));
  grid.replaceChildren(...cards);
}
