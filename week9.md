# Week 9: Accesibility and Performance Improvements

This tutorial shows how to improve accessibility by adding ARIA attributes to the park site, how to run a basic performance check with Lighthouse in Chrome, and how progressive enhancement is already used in the UI.

## 1) Change the menu trigger into a button

The menu trigger was a `<p>` element. Replace it with a real button and style it so it matches the header.

Find the "header-menu-trigger" element and replace it with this button.

### HTML update

```html
<button
  id="header-menu-trigger"
  type="button"
  aria-expanded="false"
  aria-controls="header-menu-options"
>
  ≡ MENU
</button>
```

### CSS update (`src/css/style.css`)

Update the header-menu-trigger rule to the button looks more integrated.

```css
#header-menu-trigger {
  transition: transform var(--motion-fast) var(--motion-ease), opacity var(--motion-fast) var(--motion-ease);
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  padding: .5rem;
}
```

### Why?
- `button` is keyboard accessible by default.
- `aria-expanded` tells screen readers whether the menu is open.
- `aria-controls` connects the button to the menu container.
- Larger button styles improve usability and visual consistency in the header.

## 2) Mark the hidden menu container

Add `aria-hidden="true"` to the menu container while it is closed.

```html
<div id="header-menu-options" class="is-hidden" aria-hidden="true">
```

### Why?
This tells assistive technology that the menu is currently hidden.

## 3) Label the park select menu

Add an accessible name to the `<select>` element. Find the "choose-park-select" element and replace it with the following.

```html
<select
  id="choose-park-select"
  class="is-hidden"
  aria-label="Choose a park"
></select>
```

### Why?
A select menu needs a clear label so screen readers know what it does.

## 4) Make the map modal a dialog

Turn the modal into an accessible dialog and give it a title.

Find the map-modal element and replace it with the code below.

```html
<section
  id="map-modal"
  class="is-hidden"
  role="dialog"
  aria-modal="true"
  aria-labelledby="map-modal-title"
  aria-hidden="true"
>
  <div id="map-modal-content">
    <h2 id="map-modal-title">Map</h2>
    
```

### Why?
- `role="dialog"` tells screen readers it is a modal window
- `aria-modal="true"` tells users they must interact with the dialog
- `aria-labelledby` points to the title

## 5) Add an accessible close button

Give the close button a clear label.
Find the map-modal-close element and replace it with the code below.

```html
<button id="map-modal-close" type="button" aria-label="Close map dialog">
  X
</button>
```

### Why?
The letter `X` is not descriptive enough for screen readers.

## 6) Update JavaScript when the menu opens and closes

The HTML ARIA attributes must also be updated in JavaScript. Update the render.js file with the following.

Add this function above `wireSectionMenus()`
```javascript
function setMenuState(isOpen, menuTrigger, menuOptions) {
  menuTrigger.setAttribute("aria-expanded", String(isOpen));
  menuOptions.setAttribute("aria-hidden", String(!isOpen));  
}
```

Update the `menuTrigger.addEventListener` code to add code to set the ARIA state of the menus.
```javascript
  if (menuTrigger && menuOptions) {
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
      const isOpen = menuOptions.classList.contains("is-hidden");
      setMenuState(!isOpen, menuTrigger, menuOptions);
    });
```

### What this does
- When the menu opens:
  - `aria-expanded="true"`
  - `aria-hidden="false"`
- When the menu closes:
  - `aria-expanded="false"`
  - `aria-hidden="true"`

## 7) Performance

After making accessibility improvements, run a Lighthouse report to check performance.

### Run Lighthouse in Chrome (Incognito)
1. Open **Google Chrome**.
2. Open an **Incognito window**:
   - **Windows:** `Ctrl + Shift + N`
3. In the Incognito window, open your project URL (for example, `http://localhost:5173`).
4. Open Chrome DevTools:
   - **Windows:** `F12` or `Ctrl + Shift + I`
5. Select the **Lighthouse** tab.
   - If you do not see it, click `>>` to find more tabs.
6. Keep at least **Performance** checked (you can also include Accessibility/Best Practices/SEO if needed).
7. Choose:
   - **Mode:** Navigation (default)
   - **Device:** Desktop (or Mobile, depending on assignment requirements)
8. Click **Analyze page load** (or **Generate report**).
9. Review the Performance score and opportunities list.
10. Save the report using the download icon in Lighthouse.

### Why Incognito?
Incognito reduces noise from extensions and cached browsing state, giving cleaner and more consistent Lighthouse results.

## 8) Replace the default hero map image with an optimized JPG

The initial hero image loads before park data is fetched, so it should be lightweight.

### What to change

1. Create an optimized JPG version of `us-map.png` (for example, with Squoosh, TinyJPG, or Photoshop export).
2. Save it as:
   - `src/public/images/us-map.jpg`
3. Update the hero image source in `src/index.html`:

```html
<img id="park-image" fetchpriority="high" src="images/us-map.jpg" alt="map of us" />
```

### Why?
- The default image is requested immediately on page load.
- A compressed JPG usually downloads faster than a PNG photo-style image.
- This improves perceived performance before API data appears.

## 9) Use Optimized Local Park Images with a Fallback

The NPS API often returns very large images. To improve page speed and consistency, load local optimized images instead.

### What to change

1. Save optimized images in:
   - `src/public/images/parks/[parkCode].jpg`
2. Add a default fallback image:
   - `src/public/images/parks/placeholder.jpg`
3. Add the following code into `render.js` to load the optimized image.

```javascript
const PARK_IMAGE_BASE_PATH = "/images/parks";
const PARK_IMAGE_FALLBACK = `${PARK_IMAGE_BASE_PATH}/placeholder.jpg`;

function setParkImage(park, parkImageEl) {
  if (!parkImageEl) return;

  const parkCode = (park?.parkCode ?? "").toLowerCase().trim();
  const localImage = parkCode ? `${PARK_IMAGE_BASE_PATH}/${parkCode}.jpg` : PARK_IMAGE_FALLBACK;

  parkImageEl.onerror = () => {
    parkImageEl.onerror = null;
    parkImageEl.src = PARK_IMAGE_FALLBACK;
  };

  parkImageEl.src = localImage;
  parkImageEl.alt =
    park?.fullName || park?.name
      ? `${park.fullName || park.name} landscape`
      : "National park image";
}
```

4. Update the section of code that sets the image in `render.js:renderParkData()`

```javascript
  if (park.images?.length) {
    parkImage.src = park.images[0].url;
    parkImage.alt = park.images[0].altText || park.images[0].title;
  }
```

Update to:

```javascript
setParkImage(park, parkImage);
```
5. Download the two files yell.jpg and placeholder.jpg and put them in the folder /public/images/parks


### Why we are doing this

- Faster page loads (smaller, optimized local files)
- More predictable visuals across parks
- Works even when API image URLs are slow or unavailable
- Graceful fallback with `placeholder.jpg` when a park image is missing

## 10) Progressive Enhancement Already Used in This Site

Progressive enhancement means the page provides useful default content first, then JavaScript improves it when data is available.

### Where this site already does this
- **Hero image fallback**: `#park-image` starts with a default image (`images/us-map.png`).
- **Overview defaults**: `#parkName`, `#parkType`, and `#parkStates` start with readable placeholder text.
- **Park info placeholders**: description, weather, directions, contact, and address all start with `Loading...`.
- **Fees placeholders**: both fee lists start with `<li>Loading...</li>`.
- **Map fallback**: the map iframe starts with a usable default location before park-specific coordinates are applied.

### Add a loading placeholder for promotions
Update the promotions container so users see feedback while data is loading.

```html
<section id="promotions">
  <h2>Park Promotions:</h2>
  <p id="promotion-message">Loading promotions...</p>
</section>
```

This keeps the UI informative even before API data is returned.

## 11) Final Testing Checklist

Use this checklist to confirm your accessibility, progressive enhancement, and performance updates are working.

### A) Menu ARIA behavior
1. Load the page.
2. Inspect `#header-menu-trigger` and confirm initial state:
   - `aria-expanded="false"`
3. Inspect `#header-menu-options` and confirm initial state:
   - `aria-hidden="true"`
4. Click **MENU**.
5. Confirm updated state:
   - `#header-menu-trigger` → `aria-expanded="true"`
   - `#header-menu-options` → `aria-hidden="false"`
6. Click **MENU** again and confirm values return to:
   - `aria-expanded="false"`
   - `aria-hidden="true"`

### B) Modal accessibility
1. Open the map modal.
2. Confirm `#map-modal` includes:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby="map-modal-title"`
3. Confirm close button has:
   - `aria-label="Close map dialog"`

### C) Local image + fallback behavior
1. Select a park that has a matching local image file:
   - `/public/images/parks/[parkCode].jpg`
2. Confirm the hero image loads from `/images/parks/[parkCode].jpg`.
3. Temporarily test a missing image (choose a park code without a file).
4. Confirm image falls back to:
   - `/images/parks/placeholder.jpg`

### D) Placeholder and progressive enhancement checks
1. On initial load, confirm placeholders are visible:
   - Promotions: `Loading promotions...`
   - Park info fields: `Loading...`
   - Fees lists: `Loading...`
2. After data loads, confirm placeholders are replaced with real content.

### E) Lighthouse performance check
1. Open Chrome Incognito (`Ctrl + Shift + N`).
2. Open the local site URL.
3. Run Lighthouse with **Performance** selected.
4. Save screenshot or report JSON as submission evidence.

### Done criteria
- ARIA states toggle correctly.
- Modal attributes are present.
- Local park image strategy works with fallback.
- Placeholders appear before data and are replaced after load.
- Lighthouse report completed and saved.

