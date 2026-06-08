const fadeCard = document.getElementById("fadeCard");
const popBox = document.getElementById("popBox");
const replayFade = document.getElementById("replayFade");
const replayPop = document.getElementById("replayPop");

function replayAnimation(element, className) {
  element?.classList.remove(className);
  // Force reflow so animation can restart
  void element?.offsetWidth;
  element?.classList.add(className);
}

// Run once on load
fadeCard?.classList.add("animate-fade");
popBox?.classList.add("animate-pop");

// Replay buttons
replayFade?.addEventListener("click", () => replayAnimation(fadeCard, "animate-fade"));
replayPop?.addEventListener("click", () => replayAnimation(popBox, "animate-pop"));