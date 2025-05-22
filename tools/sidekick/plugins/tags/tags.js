// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from "https://www.hlx.live/tools/sidekick/library/events/events.js";

const selectedTags = [];
let apiData=[];

function getSelectedLabel() {
  return selectedTags.length > 0
    ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
    : "No tags selected";
}

function getFilteredTags(data, query) {
  if (!query) {
    return data;
  }

  return data.filter((item) =>
    item.tag.toLowerCase().includes(query.toLowerCase())
  );
}


async function getData() {
  console.log("codebasepath" + `${window.location.origin}`);
  let apiUrl = window.location.origin + "/tools/sidekick/library.json";
  fetch(apiUrl)
    .then((response) => {  
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      const val = data.data.map((item) => {
        return item;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
const loadAndRenderTags = async () => {
  apiData = await getData(); 
  const menuHtml = await createMenuItems(apiData);
};

export async function decorate(container, data, query) {
  // if (!data) {
  //   console.warn("Tag sheet is not configured");
  //   return;
  // }

  const selectedTags = [];
  loadAndRenderTags();
  const getSelectedLabel = () => {
    return selectedTags.length ? selectedTags.join(", ") : "No tags selected";
  };

  const createMenuItems = async (apiData) => {
    return apiData
      .map((item) => {
        const isSelected = selectedTags.includes(item.tag); // 
        return `
          <div class="tag-item-wrapper">
            <ion-icon name="pricetag-outline"></ion-icon>
            <ion-icon name="pricetag"></ion-icon>
            <sp-menu-item value="${item.tag}" ${isSelected ? "selected" : ""}>
              ${item.tag}
            </sp-menu-item>
          </div>`;
      })
      .join("");
  };

  const handleMenuItemClick = (e) => {
    const { value, selected } = e.target;
    if (selected) {
      const index = selectedTags.indexOf(value);
      if (index > -1) {
        selectedTags.splice(index, 1);
      }
    } else {
      selectedTags.push(value);
    }

    const selectedLabel = container.querySelector(".selectedLabel");
    selectedLabel.textContent = getSelectedLabel();
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(selectedTags.join(", "));
    container.dispatchEvent(
      new CustomEvent("TOAST", {
        detail: { message: "Copied Tags" },
      })
    );
  };

  // ↓↓↓ Make sure to filter data based on query (optional)
  // const filteredData = getFilteredTags(data, query);

  // Await with actual data
  const menuItems = await createMenuItems(apiData);

  const sp = /* html */ `
    <sp-menu label="Select tags" selects="multiple">
      ${menuItems}
    </sp-menu>
    <sp-divider size="s"></sp-divider>
    <div class="footer">
      <sp-icon-info slot="icon"></sp-icon-info>
      <span class="selectedLabel">${getSelectedLabel()}</span>
      <sp-action-button label="Copy" quiet>
        <sp-icon-copy slot="icon"></sp-icon-copy>
      </sp-action-button>
    </div>
  `;

  const spContainer = document.createElement("div");
  spContainer.classList.add("container");
  spContainer.innerHTML = sp;
  container.append(spContainer);

  const menuItemElements = spContainer.querySelectorAll("sp-menu-item");
  menuItemElements.forEach((item) => {
    item.addEventListener("click", handleMenuItemClick);
  });

  const copyButton = spContainer.querySelector("sp-action-button");
  copyButton.addEventListener("click", handleCopyButtonClick);
}


export default {
  title: "Tags",
  searchEnabled: true,
};
