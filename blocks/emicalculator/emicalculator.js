import createField from "./form-fields.js";
let emiValue = {};
async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
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

async function calculateEMI() {
  const keys = ["principal", "years", "annualRate"];
  const inputval = document.getElementsByClassName("calValinput");
  for (let i = 0; i < keys.length; i++) {
    emiValue[keys[i]] = inputval[i].value; // Dynamic key
  }
  console.log(emiValue);

  const monthlyRate = emiValue.annualRate / 12 / 100;
  const totalMonths = emiValue.years * 12;
  const emi =
    (emiValue.principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

async function createOutputDiv() {
  const outputDiv = document.createElement("div");
  outputDiv.classList.add("outputdiv");
  const desc = document.createElement("p");
  desc.textContent = "Your EMI amount is";
  outputDiv.append(desc);
  const amountSpan = document.createElement("span");
  amountSpan.classList.add("emiamount");
  amountSpan.id = "emiamount";
  outputDiv.append(amountSpan);

  return outputDiv;
}

async function inputEventRegeister() {
  loanInput.addEventListener("input", updateEMI);
  rateInput.addEventListener("input", updateEMI);
  tenureInput.addEventListener("input", updateEMI);
}
export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  const mainWrapper = document.createElement("div");
  mainWrapper.classList.add("mainwrapper");

  const outPutDiv = await createOutputDiv();
  mainWrapper.appendChild(outPutDiv);

  const inputDiv = document.createElement("div");
  inputDiv.classList.add("inputdiv");
  const form = await createForm(formLink.href);
  inputDiv.appendChild(form);
  mainWrapper.appendChild(inputDiv);

  block.replaceChildren(mainWrapper);
  const emi = await calculateEMI();
  const sds = (block.getElementsByClassName("emiamount")[0].textContent = emi);
}
