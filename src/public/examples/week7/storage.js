const STORAGE_KEY = "favorite-rock-songs";

export const songId = (song) => `${song.title}|${song.artist}`;

export function getFavorites() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return new Set(saved ? JSON.parse(saved) : []);
}

export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}
