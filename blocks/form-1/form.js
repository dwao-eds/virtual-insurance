import createField from './form-fields.js';
import { sampleRUM } from '../../scripts/aem.js';

async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  const h1element = document.getElementById('form-headline-1');
  if (h1element) {
    const h4element = document.createElement('h4');
    h4element.innerHTML = h1element.innerHTML;
    h1element.replaceWith(h4element);
    h4element.classList.add('form-headline-4');
  }
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

function handleSubmitError(form, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  form.querySelector('button[type="submit"]').disabled = false;
  sampleRUM('form:error', { source: '.form', target: error.stack || error.message || 'unknown error' });
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    // create payload
    const payload = generatePayload(form);
    const response = await fetch(form.dataset.action, {
      method: 'POST',
      body: JSON.stringify({ data: payload }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
      if (form.dataset.confirmation) {
        window.location.href = form.dataset.confirmation;
      }
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}

export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  block.replaceChildren(form);
  var anchor = document.createElement('a');
  anchor.classList.add('cutomized-anchor');

  // Set any attributes you need for the anchor tag, such as href
  anchor.setAttribute('href', '/modal');
  
  // Select the wrapper element
  var submitWrapper = document.querySelector('.submit-wrapper');
  
  // Select the button element inside the wrapper
  var button = submitWrapper.querySelector('button');
  
  // Append the button inside the anchor tag
  anchor.appendChild(button);
  
  // Append the anchor tag with the button inside to the wrapper element
  submitWrapper.appendChild(anchor);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  //  added loader
  // Initial loader value and percentage
  let loaderValue = 0;
  const formLoader = document.getElementById('form-loader');

  // const formLoaderAfter = window.getComputedStyle(formLoader, '::after');
  // Function to update the loader value and percentage
  function updateLoader(value) {
    loaderValue = value;
    formLoader.innerText = `${loaderValue}%`;
    const percent = loaderValue;
    formLoader.setAttribute('data-progress', percent);
  }

  // Function to calculate the loader value based on selected checkboxes or radio buttons
  function calculateLoaderValue() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const radios = document.querySelectorAll('input[type="radio"]:checked');
    const totalCount = checkboxes.length + radios.length;
    const maxCount = 10; // Example maximum count
    const newLoaderValue = (totalCount / maxCount) * 100;
    return newLoaderValue;
  }

  // Event listener for changes in the loader value
  document.addEventListener('click', (event) => {
    if (event.target.type === 'radio' || event.target.type === 'checkbox') {
      const newLoaderValue = calculateLoaderValue();
      updateLoader(newLoaderValue);
    }
  });

  // Initialize the loader with the initial value
  updateLoader(loaderValue);
}
