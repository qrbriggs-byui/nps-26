export async function loadSongs() {
  const response = await fetch("./80s-rock.json");
  if (!response.ok) throw new Error("Could not load songs.");
  return response.json();
}
