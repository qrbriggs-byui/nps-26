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

  if (
    !openLink ||
    !modal ||
    !closeButton ||
    !thanksCloseButton ||
    !formView ||
    !thanksView ||
    !form ||
    !nameInput ||
    !emailInput ||
    !feedbackInput ||
    !errorMessage
  ) {
    return;
  }

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
  }

  function showError(message) {
    errorMessage.textContent = message;
  }

  openLink.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });

  closeButton.addEventListener('click', closeModal);
  thanksCloseButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('is-hidden')) {
      closeModal();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const feedbackValue = feedbackInput.value.trim();

    if (!nameRegex.test(nameValue)) {
      showError('Enter a valid name.');
      nameInput.focus();
      return;
    }

    if (!emailRegex.test(emailValue)) {
      showError('Enter a valid e-mail address.');
      emailInput.focus();
      return;
    }

    if (!feedbackRegex.test(feedbackValue)) {
      showError('Feedback must be 10 to 500 characters long.');
      feedbackInput.focus();
      return;
    }

    formView.classList.add('is-hidden');
    thanksView.classList.remove('is-hidden');
    thanksCloseButton.focus();
  });
}