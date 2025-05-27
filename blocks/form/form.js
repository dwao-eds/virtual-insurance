import createField from "./form-fields.js";
import { getMetadata, sampleRUM } from "../../scripts/aem.js";
import { linkModals } from "../../scripts/scripts.js";

async function createForm(formHref) {
  const { pathname,search } = new URL(formHref);
  const resp = await fetch(pathname+search);
  const json = await resp.json();

  const form = document.createElement("form");
  const h1element = document.getElementById("form-headline-1");
  if (h1element) {
    const h4element = document.createElement("h4");
    h4element.innerHTML = h1element.innerHTML;
    h1element.replaceWith(h4element);
    h4element.classList.add("form-headline-4");
  }
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split(".json")[0];
  const fields = await Promise.all(
    json.data.map((fd) => createField(fd, form))
  );
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll("fieldset");
  fieldsets.forEach((fieldset) => {
    form
      .querySelectorAll(`[data-fieldset="${fieldset.name}"`)
      .forEach((field) => {
        fieldset.append(field);
      });
  });

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== "submit" && !field.disabled) {
      if (field.type === "radio") {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === "checkbox") {
        if (field.checked)
          payload[field.name] = payload[field.name]
            ? `${payload[field.name]},${field.value}`
            : field.value;
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
  sampleRUM("form:error", {
    source: ".form",
    target: error.stack || error.message || "unknown error",
  });
}

async function handleSubmit(form, paylod) {
  var templateParams = {};
  if (form.getAttribute("data-submitting") === "true") return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute("data-submitting", "true");
    submit.disabled = true;

    // create payload
    // const payload = generatePayload(form);
    const response = await fetch(
      "https://682dcac34fae1889475790a7.mockapi.io/dummy-data",
      {
        method: "POST",
        body: JSON.stringify(paylod),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const emailInput = document
        .querySelector("form")
        .querySelector('input[name="Email"]');
      if (emailInput && emailInput.value.trim() !== "") {
        templateParams.email = emailInput.value.trim();
      }

      emailjs.send("service_pu9bnco", "template_gq2p1vr", templateParams).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          emailInput.value = "";
          linkModals();
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );

      // sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
      // if (form.dataset.confirmation) {
      //   window.location.href = form.dataset.confirmation;

      // }
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute("data-submitting", "false");
  }
}

function getFormData() {
  const form = document.querySelector(
    'form[data-action="/forms/calculate-insurance-form"]'
  );
  const formData = {};

  // Get radio values (like gender)
  const gender = form.querySelector('input[name="gender"]:checked');
  if (gender) {
    formData.gender = gender.value;
  }

  // Get all checked checkboxes
  const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach((checkbox) => {
    formData[checkbox.name] = true; // Set true for checked
  });

  // Get phone number input
  const phoneInput = form.querySelector('input[name="phoneNumber"]');
  if (phoneInput && phoneInput.value.trim() !== "") {
    formData.phoneNumber = phoneInput.value.trim();
  }

  const emailInput = form.querySelector('input[name="Email"]');
  if (emailInput && emailInput.value.trim() !== "") {
    formData.Email = emailInput.value.trim();
  }
  return formData;
}
export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  debugger;
  if (!formLink) return;
  const langCode = getMetadata("language-code")
    ? getMetadata("language-code")
    : "en";
  const queryParamFormLink = `${formLink.href}?sheet=${langCode}`;
  const form = await createForm(queryParamFormLink);
  block.replaceChildren(form);
  var anchor = document.createElement("a");
  anchor.classList.add("cutomized-anchor");

  // Set any attributes you need for the anchor tag, such as href
  anchor.setAttribute("href", "/modal");

  // Select the wrapper element
  var submitWrapper = document.querySelector(".submit-wrapper");

  // Select the button element inside the wrapper
  var button = submitWrapper.querySelector("button");

  // Append the button inside the anchor tag
  anchor.appendChild(button);

  // Append the anchor tag with the button inside to the wrapper element
  submitWrapper.appendChild(anchor);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = form.checkValidity();

    const data = getFormData();

    if (valid) {
      handleSubmit(form, data);
    } else {
      const firstInvalidEl = form.querySelector(":invalid:not(fieldset)");
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  //  added loader
  // Initial loader value and percentage
  let loaderValue = 0;
  const formLoader = document.getElementById("form-loader");

  // const formLoaderAfter = window.getComputedStyle(formLoader, '::after');
  // Function to update the loader value and percentage
  function updateLoader(value) {
    loaderValue = value;
    formLoader.innerText = `${loaderValue}%`;
    const percent = loaderValue;
    formLoader.setAttribute("data-progress", percent);
  }

  // Function to calculate the loader value based on selected checkboxes or radio buttons
  function calculateLoaderValue() {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const radios = document.querySelectorAll('input[type="radio"]:checked');
    const totalCount = checkboxes.length + radios.length;
    const maxCount = 10; // Example maximum count
    const newLoaderValue = (totalCount / maxCount) * 100;
    return newLoaderValue;
  }

  // Event listener for changes in the loader value
  document.addEventListener("click", (event) => {
    if (event.target.type === "radio" || event.target.type === "checkbox") {
      const newLoaderValue = calculateLoaderValue();
      updateLoader(newLoaderValue);
    }
  });

  // Initialize the loader with the initial value
  updateLoader(loaderValue);
}
