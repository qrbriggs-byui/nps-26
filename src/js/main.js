const MENU_DATA_URL = "/data/menu.json";
const NPS_PARK_URL = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = import.meta.env.VITE_NPS_API_KEY;
const DEFAULT_PARK_CODE = "yell";
const PARKS_DATA_URL = "/data/parks.json";
const FAVORITES_KEY = "favorite-parks";

function loadParkData() {
  document.getElementById("parkName").textContent = "Yellowstone";
  document.getElementById("parkType").textContent = "National Park";
  document.getElementById("parkStates").textContent = "WY, ID, MT";
  document.querySelector("#park-image").src = "./images/yellowstone.jpg";
}

async function fetchParkData(parkCode = DEFAULT_PARK_CODE) {
  const response = await fetch(`${NPS_PARK_URL}?parkCode=${parkCode}`, {
    headers: {
      "X-Api-Key": NPS_API_KEY,
    },
  });

  const payload = await response.json();
  return payload.data[0];
}

function renderParkInfoDetails(park) {
  document.getElementById("info-description").textContent = park.description;
  document.getElementById("info-weather").textContent = park.weatherInfo;
  document.getElementById("info-directions").textContent = park.directionsInfo;

  const directionsLink = document.getElementById("info-directions-link");
  directionsLink.href = park.directionsUrl;
  directionsLink.textContent = "Read more";

  const primaryContact = park.contacts.phoneNumbers.find(phone => phone.type === "Voice");
  document.getElementById("info-contact").textContent =
    primaryContact.phoneNumber;

  const physicalAddress = park.addresses.find(address => address.type === "Physical");
  document.getElementById("info-address").textContent =
    `${physicalAddress.line1}, ${physicalAddress.city}, ${physicalAddress.stateCode} ${physicalAddress.postalCode}`;
}

function renderParkFeesSection(park) {
  const fees = document.getElementById("fees-entrance-fees");
  const passes = document.getElementById("fees-entrance-passes");

  fees.innerHTML = park.entranceFees
    .map(
      (fee) =>
        `<li><strong>${fee.title}</strong>: $${fee.cost} - ${fee.description}</li>`,
    )
    .join("");

  passes.innerHTML = park.entrancePasses
    .map(
      (pass) =>
        `<li><strong>${pass.title}</strong>: $${pass.cost} - ${pass.description}</li>`,
    )
    .join("");
}

function updateOverviewFromParkData(park) {
  const parkName = document.getElementById("parkName");
  const parkType = document.getElementById("parkType");
  const parkStates = document.getElementById("parkStates");
  const parkImage = document.getElementById("park-image");

  parkName.textContent = park.name;
  parkType.textContent = park.designation;
  parkStates.textContent = park.states;

  parkImage.src = park.images[0].url;
  parkImage.alt = park.images[0].altText || park.images[0].title;
}

function updateMapLink(park) {
  const iframe = document.getElementById("mapFrame");
  const lat = park.latitude;
  const lng = park.longitude; 
  iframe.src = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=8`;
}

async function loadAndRenderParkInfo(parkCode) {
  const park = await fetchParkData(parkCode);
  updateOverviewFromParkData(park);
  renderParkInfoDetails(park);
  renderParkFeesSection(park);
  updateMapLink(park);
}

function buildHeaderMenuWithThen() {
  // Find the <ul> where header menu items will be inserted.
  const headerMenuList = document.querySelector("#header-menu-options ul");
  // If the target does not exist on this page, stop.
  if (!headerMenuList) return;

  // Load the JSON data, then build each <li> from menu items.
  fetch(MENU_DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      // Clear any existing static or previous menu content.
      headerMenuList.innerHTML = "";

      // Create one <li> per menu item from JSON.
      data.menu.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.dataset.menuId = item.id;
        li.dataset.href = item.href;

        // Preserve the special ID used by map modal logic.
        if (item.id === "maps") {
          li.id = "header-maps-link";
        }

        headerMenuList.appendChild(li);
      });
    });
}

async function buildParkMenuWithAsyncAwait() {
  // Find the <ul> where park-menu items will be inserted.
  const parkMenuList = document.querySelector("#park-menu ul");
  // If the target does not exist on this page, stop.
  if (!parkMenuList) return;

  // Wait for menu JSON data.
  const response = await fetch(MENU_DATA_URL);
  const data = await response.json();

  // Build all menu HTML at once using a template string.
  parkMenuList.innerHTML = data.menu
    .map(
      (item) => `
        <li
          ${item.id === "maps" ? 'id="park-maps-link"' : ""}
          data-menu-id="${item.id}"
          data-href="${item.href}">
          <p>${item.name}</p>
          <p>
            <svg>
              <use href="${item.iconUrl}"></use>
            </svg>
          </p>
        </li>
      `,
    )
    .join("");
}

function setActiveSection(section) {
  const infoSection = document.getElementById("park-info");
  const feesSection = document.getElementById("park-fees");

  const showInfo = section === "info";
  infoSection.classList.toggle("is-hidden", !showInfo);
  feesSection.classList.toggle("is-hidden", showInfo);
}

function resolveMenuIdFromClickTarget(target) {
  const li = target.closest("li");
  return li.dataset.menuId.trim().toLowerCase();
}

function addEventListeners() {
  const menuTrigger = document.querySelector("#header-menu-trigger");
  const menuOptions = document.querySelector("#header-menu-options");
  const overview = document.querySelector("#overview");
  const parkMenu = document.querySelector("#park-menu");

  // MENU toggle
  if (menuTrigger && menuOptions) {
    // Don't add these listeners if the elements don't exist
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
    });

    menuOptions.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (parkMenu){
    parkMenu.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  // Overlay hover color toggle
  if (overview) {
    // Don't add these listeners if the element doesn't exist
    overview.addEventListener("mouseenter", () => {
      overview.classList.add("overlay-hover");
    });

    overview.addEventListener("mouseleave", () => {
      overview.classList.remove("overlay-hover");
    });
  }
}

function setupMapModalAndPromotions() {
  const headerMapsLink = document.getElementById("header-maps-link");
  const parkMapsLink = document.getElementById("park-maps-link");
  const mapModal = document.getElementById("map-modal");
  const mapModalClose = document.getElementById("map-modal-close");
  const promotionMessage = document.getElementById("promotion-message");

  function openMapModal() {
    if (mapModal) mapModal.classList.remove("is-hidden");
  }

  function closeMapModal() {
    if (mapModal) mapModal.classList.add("is-hidden");
  }

  headerMapsLink.addEventListener("click", openMapModal);
  parkMapsLink.addEventListener("click", openMapModal);
  mapModalClose.addEventListener("click", closeMapModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMapModal();
    }
  });

  const weekdayPromotions = {
    1: "Monday Special: Buy one get one park entrance.",
    2: "Tuesday Deal: 10% off park admissions.",
    3: "Wednesday Offer: Free junior ranger booklet with entry.",
    4: "Thursday Bonus: Free Yellowstone postcard at check-in.",
    5: "Friday Feature: 15% off annual pass upgrade.",
  };

  const day = new Date().getDay();
  if (promotionMessage) {
    if (day === 0 || day === 6) {
      promotionMessage.textContent = "No Promotions today";
    } else {
      promotionMessage.textContent = weekdayPromotions[day];
    }
  }
}

function getParkCodeFromQuery(defaultParkCode = DEFAULT_PARK_CODE) {
  const params = new URLSearchParams(window.location.search);
  const parkCode = params.get("park");
  return parkCode ? parkCode : defaultParkCode;
}

const activeParkCode = getParkCodeFromQuery(DEFAULT_PARK_CODE);

/* =========================
   Park chooser + favorites
   ========================= */


function readFavorites() {
  const value = localStorage.getItem(FAVORITES_KEY);
  return value ? JSON.parse(value) : [];
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

function addFavorite(park) {
  const favorites = readFavorites();

  // .some() checks whether AT LEAST ONE item in the array matches the condition.
  // It loops through favorites and returns:
  // - true  -> as soon as it finds a matching parkCode
  // - false -> if no item matches after checking all items
  //
  // Here, we're using it to prevent duplicates before pushing a new favorite.
  const exists = favorites.some((p) => p.parkCode === park.parkCode);

  if (!exists) {
    favorites.push(park);
    saveFavorites(favorites);
  }
}

function removeFavorite(parkCode) {
  // .filter() creates a NEW array containing only items that pass the test.
  // For each favorite park:
  // - keep it when its parkCode is NOT the one being removed
  // - drop it when its parkCode matches the one being removed
  //
  // Result: the returned array excludes the selected park.
  const favorites = readFavorites().filter((p) => p.parkCode !== parkCode);

  saveFavorites(favorites);
  return favorites;
}

function buildParkUrl(parkCode) {
  return `${window.location.pathname}?park=${parkCode}`;
}

function renderFavorites() {
  const container = document.getElementById(FAVORITES_CONTAINER_ID);
  if (!container) return;

  const favorites = readFavorites();
  if (!favorites.length) {
    container.classList.add("is-hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("is-hidden");
  container.innerHTML = `
    <div class="favorites-inner">
      <h2>Favorite Parks</h2>
      <ul class="favorites-list">
        ${favorites
          .map(
            (park) => `
              <li>
                <a href="${buildParkUrl(park.parkCode)}">${park.name} (${park.parkCode})</a>
                <button type="button" class="favorite-remove" data-park-code="${park.parkCode}">(X)</button>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;

  container.querySelectorAll(".favorite-remove").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const code = event.currentTarget?.dataset?.parkCode;
      if (!code) return;
      removeFavorite(code);
      renderFavorites();
    });
  });
}

async function loadParkSelectorData(parksUrl) {
  const response = await fetch(parksUrl);
  if (!response.ok) return [];

  const data = await response.json();
  return Array.isArray(data?.parkNames) ? data.parkNames : [];
}

const CHOOSE_PARK_BUTTON_ID = "choose-park-btn";
const CHOOSE_PARK_SELECT_ID = "choose-park-select";
const FAVORITES_CONTAINER_ID = "favorites-section";

function renderParkSelectorOptions(select, parks, currentParkCode) {
  select.innerHTML = `
    <option value="">Select a park...</option>
    ${parks
      .map(
        (park) =>
          `<option value="${park.parkCode}"${
            park.parkCode === currentParkCode ? " selected" : ""
          }>${park.name}</option>`,
      )
      .join("")}
  `;
}

function wireParkSelectorToggle(button, select) {
  button.addEventListener("click", () => {
    select.classList.toggle("is-hidden");
  });
}

function wireParkSelectorChange(select, parks) {
  select.addEventListener("change", () => {
    const parkCode = select.value;
    if (!parkCode) return;

    const park = parks.find((p) => p.parkCode === parkCode);
    if (park) addFavorite({ name: park.name, parkCode: park.parkCode });

    window.location.href = buildParkUrl(parkCode);
  });
}

function renderParkSelectorUI(parks, currentParkCode) {
  const button = document.getElementById(CHOOSE_PARK_BUTTON_ID)
  const select = document.getElementById(CHOOSE_PARK_SELECT_ID)

  renderFavorites();
  renderParkSelectorOptions(select, parks, currentParkCode);
  wireParkSelectorToggle(button, select);
  wireParkSelectorChange(select, parks);
}

async function initParkSelectorUI(currentParkCode, parksUrl) {
  const parks = await loadParkSelectorData(parksUrl);
  renderParkSelectorUI(parks, currentParkCode);
}

async function init() {
  // loadParkData();
  buildHeaderMenuWithThen();
  await buildParkMenuWithAsyncAwait();
  await loadAndRenderParkInfo(activeParkCode);

  setActiveSection("info");

  addEventListeners();
  setupMapModalAndPromotions();
  await initParkSelectorUI(activeParkCode, PARKS_DATA_URL);
}

init();
