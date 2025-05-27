import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

function langSwitchEventRegister() {
  const anchors = document.querySelectorAll(".subheader-list > a");

  anchors.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      event.currentTarget.removeAttribute('target');

      const currentLangCode = getMetadata("language-code") || "";
      const changeLangCode = event.currentTarget
        .getAttribute("title")
        .toLowerCase();
      let pagePath = window.location.pathname;

      if (currentLangCode === changeLangCode) {
        console.log("Same language selected, no redirection needed.");
        return;
      }

      const langPrefix = `/${currentLangCode}`;
      if (pagePath.startsWith(langPrefix)) {
        pagePath = pagePath.slice(langPrefix.length);
      }

      if (!pagePath.startsWith("/")) {
        pagePath = "/" + pagePath;
      }

      // Build new path with changed language
      const newPath =
        changeLangCode === "en" ? pagePath : `/${changeLangCode}${pagePath}`;
      const redirectPath = `${window.location.origin}${newPath}`;
      console.log(`Redirecting to: ${redirectPath}`);
      window.location.href = redirectPath;

    });
  });
}

export default async function decorate(block) {
  const subHeaderMeta = getMetadata("sub");
  const subHeaderPath = subHeaderMeta
    ? new URL(subHeaderMeta, window.location).pathname
    : "/sub";
  try {
    const subHeaderFragment = await loadFragment(subHeaderPath);
    if (subHeaderFragment && subHeaderFragment.firstElementChild) {
      const subHeader = document.createElement("div");
      subHeader.classList.add("subheader-wrapper");
      while (subHeaderFragment.firstElementChild) {
        subHeader.append(subHeaderFragment.firstElementChild);
      }
      const liElements = subHeader.querySelectorAll("li");
      liElements.forEach((li) => {
        li.classList.add("subheader-list");
      });
      block.textContent = "";
      block.append(subHeader);

      langSwitchEventRegister();
    } else {
      console.error("Subheader fragment is empty or malformed.");
    }
  } catch (error) {
    console.error("Error fetching or loading subheader fragment:", error);
  }
}
