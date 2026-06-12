# Week 10 Tutorial: Adding a Feedback Modal + SEO Metadata

This tutorial shows how to add a **Feedback** link to the footer, open a modal dialog, validate a form with regular expressions, and show a thank-you message after submission. You will also learn how to make your site more discoverable with metadata.

## 1. Add the Footer Link

Add a link in the footer so users can open the feedback form.

```html
<a id="footer-feedback-link" href="#">Feedback</a>
```

### What this does
- Creates a clickable footer link.
- Keeps the link inline with the footer text.
- Uses an ID so JavaScript can find it.

---

## 2. Add the Modal HTML

Add a modal section near the bottom of the page.

```html
<section
  id="feedback-modal"
  class="is-hidden"
  role="dialog"
  aria-modal="true"
  aria-labelledby="feedback-modal-title"
  aria-hidden="true"
>
  <div id="feedback-modal-content">
    <button id="feedback-modal-close" type="button" aria-label="Close feedback dialog">
      X
    </button>

    <h2 id="feedback-modal-title">Feedback</h2>

    <div id="feedback-form-view">
      <form id="feedback-form" novalidate>
        <label for="feedback-name">Name</label>
        <input id="feedback-name" name="name" type="text" autocomplete="name" required />

        <label for="feedback-email">E-mail</label>
        <input id="feedback-email" name="email" type="email" autocomplete="email" required />

        <label for="feedback-message">Feedback</label>
        <textarea id="feedback-message" name="feedback" rows="6" required></textarea>

        <p id="feedback-error" class="form-error" aria-live="polite"></p>

        <button class="feedback-submit-btn" type="submit">
          Send Your Feedback
        </button>
      </form>
    </div>

    <div id="feedback-thanks" class="is-hidden">
      <p>Thank you for your feedback!</p>
      <button id="feedback-thanks-close" type="button">Close</button>
    </div>
  </div>
</section>
```

### What this does
- `role="dialog"` and `aria-modal="true"` tell assistive technology that this is a modal.
- `novalidate` turns off browser validation so JavaScript controls validation.
- The form includes three fields:
  - Name
  - E-mail
  - Feedback
- The thank-you message is hidden until the form is submitted successfully.

---

## 3. Add the CSS

Add the following feedback-related styles from your stylesheet. 
Start by updating the footer rule and add the rest right below it.

### Footer and footer link
```css
footer {
  padding: 1rem;
  background-color: var(--header-color);
  color: white;
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
}

footer a,
#feedback-modal button,
.feedback-submit-btn {
  border: 0;
  border-radius: 0.5rem;
  font: inherit;
  cursor: pointer;
  border: 1px solid white;
}

#footer-feedback-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.1rem;
  text-decoration: none;
  background: #1f5f8b;
  color: #fff;
  font-weight: 700;
}

#footer-feedback-link:hover,
#footer-feedback-link:focus-visible {
  background: #174866;
}
```

### Modal
```css
#feedback-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.65);
}

#feedback-modal-content {
  position: relative;
  width: min(100%, 34rem);
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 1rem;
  background: #fff;
  color: #111;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.25);
}

#feedback-modal-close,
#feedback-thanks-close {
  padding: 0.6rem 0.9rem;
  background: #1f5f8b;
  color: #fff;
  font-weight: 700;
}

#feedback-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

#feedback-form,
#feedback-thanks {
  display: grid;
  gap: 1rem;
}

#feedback-form label {
  font-weight: 700;
}

#feedback-form input,
#feedback-form textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #bbb;
  border-radius: 0.6rem;
  font: inherit;
}

#feedback-form textarea {
  resize: vertical;
  min-height: 10rem;
}

.feedback-submit-btn {
  width: 100%;
  padding: 1rem;
  background: #1f5f8b;
  color: #fff;
  font-weight: 700;
}

.feedback-submit-btn:hover,
.feedback-submit-btn:focus-visible,
#feedback-modal-close:hover,
#feedback-modal-close:focus-visible,
#feedback-thanks-close:hover,
#feedback-thanks-close:focus-visible {
  background: #174866;
}

.form-error {
  min-height: 1.25rem;
  color: #b00020;
  font-weight: 700;
  margin: 0;
}
```

### What this does
- Styles footer link, modal overlay, modal panel, buttons, form controls, and error message.
- Ensures comfortable spacing/padding and consistent button appearance.

---

## 4. Create the Feedback Module

Create a new file named `feedback.js`.

```js
export function initFeedback() {
  const openLink = document.querySelector('#footer-feedback-link');
  const modal = document.querySelector('#feedback-modal');
  const closeButton = document.querySelector('#feedback-modal-close');
  const thanksCloseButton = document.querySelector('#feedback-thanks-close');
  const formView = document.querySelector('#feedback-form-view');
  const thanksView = document.querySelector('#feedback-thanks');
  const form = document.querySelector('#feedback-form');
  const nameInput = document.querySelector('#feedback-name');
  const emailInput = document.querySelector('#feedback-email');
  const feedbackInput = document.querySelector('#feedback-message');
  const errorMessage = document.querySelector('#feedback-error');

  const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const feedbackRegex = /^.{10,500}$/s;

  function openModal() {
    modal.classList.remove('is-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    formView.classList.remove('is-hidden');
    thanksView.classList.add('is-hidden');
    errorMessage.textContent = '';
    form.reset();
    nameInput.focus();
  }

  function closeModal() {
    modal.classList.add('is-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  openLink.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  closeButton.addEventListener('click', closeModal);
  thanksCloseButton.addEventListener('click', closeModal);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!nameRegex.test(nameInput.value.trim())) {
      errorMessage.textContent = 'Enter a valid name.';
      return;
    }

    if (!emailRegex.test(emailInput.value.trim())) {
      errorMessage.textContent = 'Enter a valid e-mail address.';
      return;
    }

    if (!feedbackRegex.test(feedbackInput.value.trim())) {
      errorMessage.textContent = 'Feedback must be 10 to 500 characters long.';
      return;
    }

    formView.classList.add('is-hidden');
    thanksView.classList.remove('is-hidden');
  });
}
```

### What this code does
- Finds the modal elements in the page.
- Opens the modal when the footer link is clicked.
- Closes the modal with the X button, the Close button, or the Escape key.
- Uses regular expressions to validate:
  - Name
  - E-mail
  - Feedback text
- Replaces the form with a thank-you message after successful submission.

---

## 5. Initialize the Module in `main.js`

Add the import and call the setup function.

```js
import { initFeedback } from './feedback.js';

initFeedback();
```

### What this does
- Loads the feedback module.
- Starts the feedback feature when the page loads.

---

## 6. Why Regular Expressions Were Used

Regular expressions are a simple way to check whether user input follows a pattern.

### Example patterns
- **Name:** allows letters, spaces, apostrophes, and hyphens.
- **E-mail:** checks for the basic `name@site.com` structure.
- **Feedback:** requires at least 10 characters and no more than 500.

---

# Part 2: Add SEO + Social Metadata

This section helps make your project easier to find in search engines and better-looking when shared on social media.

## 7. Update the `<head>` in `index.html`

Add these tags inside the `<head>` section:

```html
<title>US National Parks Explorer | WDD 231</title>
<meta
  name="description"
  content="Explore U.S. National Parks with park details, alerts, events, maps, and visitor information."
/>
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://your-domain.example/" />

<meta property="og:type" content="website" />
<meta property="og:title" content="US National Parks Explorer | WDD 231" />
<meta
  property="og:description"
  content="Discover U.S. National Parks with maps, alerts, weather, and park information."
/>
<meta property="og:url" content="https://your-domain.example/" />
<meta property="og:image" content="https://your-domain.example/images/us-map.jpg" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="US National Parks Explorer | WDD 231" />
<meta
  name="twitter:description"
  content="Discover U.S. National Parks with maps, alerts, weather, and park information."
/>
<meta name="twitter:image" content="https://your-domain.example/images/us-map.jpg" />
```

### What this does
- **`<title>`**: The main page title shown in browser tabs and search results.
- **`meta description`**: Summary often displayed under the search result title.
- **`robots`**: Tells search engines they can index the page.
- **`canonical`**: Defines the preferred URL for this page.
- **Open Graph (`og:*`)**: Controls link preview text/image on social platforms.
- **Twitter tags**: Controls preview appearance on X/Twitter.

## 8. Helpful Notes for Students

- Use a **specific title** (not just “Home”).
- Keep descriptions around **140–160 characters** when possible.
- `og:image` and `twitter:image` should be a **full URL** to a real image.
- On local development (`localhost`), previews may not work until deployed.
- Keep your metadata aligned with your real content (don’t mislead users).

## 9. Optional Advanced Step: Structured Data

If you want to go further, add this in `<head>` to help search engines and AI systems understand your page type:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "US National Parks Explorer",
  "description": "A student project for exploring U.S. National Parks."
}
</script>
```

---

## 10. Quick Testing Checklist (Modal + SEO)

Use this quick checklist to verify your work before submitting.

### Modal checks
- [ ] Footer **Feedback** link appears and is clickable.
- [ ] Clicking **Feedback** opens the modal.
- [ ] Clicking **X** closes the modal.
- [ ] Clicking **Close** on the thank-you view closes the modal.
- [ ] Invalid inputs show an error message.
- [ ] Valid inputs show the thank-you message.
- [ ] Pressing **Esc** closes the modal (if implemented).
- [ ] Modal starts hidden on initial page load.

### SEO + social metadata checks
- [ ] `<title>` is specific to your page (not generic like “Home”).
- [ ] `<meta name="description">` exists and matches page content.
- [ ] `<meta name="robots" content="index, follow">` exists.
- [ ] `<link rel="canonical" href="...">` uses your deployed URL.
- [ ] Open Graph tags exist: `og:type`, `og:title`, `og:description`, `og:url`, `og:image`.
- [ ] Twitter tags exist: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- [ ] `og:image` and `twitter:image` use a valid full URL.
- [ ] Placeholder values like `your-domain.example` have been replaced.

### How to verify quickly in browser
- Open DevTools (**F12**) → **Elements** tab → inspect the `<head>`.
- Confirm all metadata tags are present and values are correct.
- Optional: test your deployed URL in:
  - Facebook Sharing Debugger
  - X/Twitter Card Validator