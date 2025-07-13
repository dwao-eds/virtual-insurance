(function () {
  let pageStrutcutre = false;
  let linkloaded = false;

  let currentFontSize = 100;
  let imagesHidden = false;
  let altShown = true;
  let speech,
    readingLine,
    readingLineOn = false;
  let skipLinkEnabled = false;
  let mediaPaused = false;
  let magnifierEnabled = false;
  let fontSizeLevel = 0;
  const fontSizeSteps = [100, 110, 120]; // percentages



  // const createEl = (tag, props = {}, styles = {}, children = []) => {
  //   const el = document.createElement(tag);
  //   Object.assign(el, props);
  //   Object.assign(el.style, styles);
  //   children.forEach((child) => el.appendChild(child));
  //   return el;
  // };

  const css = `
 #accessibilityToggleBtn {
      position: fixed !important;
      bottom: 10px;
      left: 20px;
      z-index: 9999;
      background: #004080;
      color: #fff;
      padding: 10px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      
    }
/* Main panel container */
.accessibility-panel,  #pageList {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 24px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-height: 90vh;
        position: fixed !important;
    bottom: 50px;
    left: 20px;
    max-height: 90vh;
    overflow-y: auto;
    background: #f9f9f9;
    border-radius: 12px;
    padding: 16px;
    font-family: sans-serif;
    font-size: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    z-index: 9998;
    display: none;
}

@media (max-width: 768px) {
  .accessibility-panel,
  #pageList {
    width: 90vw;
    left: 5vw;
    right: 5vw;
    bottom: 20px;
    padding: 12px;
    font-size: 11px;
    gap: 20px;
    max-height: 80vh;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  }
}

  #pageList {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 24px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-height: 90vh;
        position: fixed !important;
    bottom: 50px;
    left: 20px;
    max-height: 90vh;
    overflow-y: auto;
    background: #f9f9f9;
    border-radius: 12px;
    padding: 16px;
    font-family: sans-serif;
    font-size: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    display: none;
}

@media (max-width: 768px) {
  #pageList {
   width: 80%;
  }


  .accessibility-panel button {
  background: none  !important;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

/* Panel header */
.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.panel-header h1 {
    font-size: 24px;
    font-weight: 500;
    color: #111111;
    line-height: 28.8px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    color: #111111;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: #663db3;
}

/* Panel content */
.panel-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    width: 100%;
}

.reset-all {
    align-self: flex-end;
    font-weight: 500;
    color: #663db3;
    font-size: 16px;
    line-height: 19.2px;
    cursor: pointer;
    transition: color 0.2s ease;
}

.reset-all:hover {
    color: #5a2d9e;
}

/* Scroll area */
.scroll-area {
    position: relative;
    width: 100%;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 8px;
}

.scroll-area::-webkit-scrollbar {
    width: 3px;
}

.scroll-area::-webkit-scrollbar-track {
    background: #e9e6e6;
}

.scroll-area::-webkit-scrollbar-thumb {
    background: #663db3;
    border-radius: 2px;
}

/* Accordion container */
.accordion-container-acces{
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

@media (max-width: 768px) {
  .accordion-container-acces {
    width: 90%;
  }
}


/* Accordion items */
.accordion-item-acces {
    width: 360px;
    border: 1px solid rgba(17, 17, 17, 0.2);
    border-radius: 10px;
    padding: 20px 16px;
    background: white;
}

.accordion-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    font-weight: 400;
    color: black;
    line-height: 21.6px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 0;
    transition: color 0.2s ease;
}

.accordion-trigger:hover {
    color: #663db3;
}

.accordion-icon {
    transition: transform 0.2s ease;
    color: #111111;
}

.accordion-item-acces.active .accordion-icon {
    transform: rotate(180deg);
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding-top 0.3s ease;
    padding-top: 0;
}

.accordion-item-acces.active .accordion-content {
    max-height: 500px;
    padding-top: 24px;
}

/* Options grid */
.options-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.options-row {
    display: flex;
    gap: 16px;
    width: 100%;
}

/* Option cards */
.option-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 8px;
    flex: 1;
    height: 98px;
    background: white;
    border: 1px solid rgba(17, 17, 17, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

@media (max-width: 768px) {
  .option-card {
    padding: 4px 8px;
  }
}


.option-card:hover {
    border-color: #663db3;
    box-shadow: 0 2px 8px rgba(102, 61, 179, 0.1);
    transform: translateY(-1px);
}

.option-card.empty {
    opacity: 0;
    cursor: default;
}

.option-card.empty:hover {
    border-color: rgba(17, 17, 17, 0.2);
    box-shadow: none;
    transform: none;
}

.option-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.option-label {
    font-size: 14px;
    font-weight: 400;
    color: #111111;
    text-align: center;
    line-height: 16.8px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 80px;
}

.option-label.multiline {
    line-height: 16.8px;
}

/* ADHD custom icon */
.adhd-icon {
    position: relative;
    width: 24px;
    height: 24px;
}

.adhd-bg {
    position: absolute;
    width: 22px;
    height: 24px;
    left: 1px;
    background-image: url('public/group.png');
    background-size: 100% 100%;
}

.adhd-inner {
    position: absolute;
    width: 14px;
    height: 14px;
    top: 2px;
    left: 3px;
    background-image: url('public/group-1.png');
    background-size: 100% 100%;
}

/* Custom scrollbar */
.scrollbar {
    position: absolute;
    right: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: #e9e6e6;
    border-radius: 2px;
}

@media (max-width: 768px) {
  .scrollbar {
 display: none;
  }
}


.scrollbar-thumb {
    position: absolute;
    width: 3px;
    top: 67px;
    background: #663db3;
    border-radius: 2px;
}

/* Responsive design */
@media (max-width: 480px) {
    .accessibility-panel {
        width: 100%;
        max-width: 80%;
        padding: 20px 16px;
    }
    
    .accordion-item-acces {
        width: 100%;
    }
    
    .option-card {
        min-height: 98px;
    }
    
    .option-label {
        font-size: 12px;
        max-width: 70px;
    }
}

/* Active states */
.option-card.active {
   border-color: #663db3;
    box-shadow: 0 2px 8px rgba(102, 61, 179, 0.1);
    transform: translateY(-1px);
}

// .option-card.active .option-label {
//     color: white;
// }

.option-steps {
  margin-top: 6px;
  padding-left: 0px;
}





.option-steps ul{
list-style: circle;
    display: none;
    width: 100%;
    margin: 5px auto 0;
    text-align: center;
    position: relative;
    padding: 0px;}
.option-steps li {
    width: 7px;
    height: 7px;
    background: #ccc;
    display: inline-block;
    margin: 0 5px;
    border-radius: 100%;
}





.option-steps {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  display: flex;
  gap: 6px;
  justify-content: flex-start;
}

.option-steps li {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc; /* Inactive step */
  transition: background-color 0.3s ease;
}

.option-steps li.active {
  background-color: #000; /* Active step */
}



/* Focus states for accessibility */
.option-card:focus,
.close-btn:focus {
    outline: 2px solid #663db3;
    outline-offset: 2px;
}

/* Animation for smooth interactions */
.option-card {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
#readingLine{
position: fixed; height: 2px; width: 100%; background: red; top: 50%; left: 0px; z-index: 10000; pointer-events: none;
}





.card {
  width: 400px;
  background: white;
  border: 1px solid transparent;
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 20px 20px 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 24px;
  font-weight: 500;
  color: #111111;
  line-height: 28.8px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.close-icon {
  width: 24px;
  height: 24px;
  color: #111111;
  cursor: pointer;
}

.close-icon:hover {
  color: #666666;
}

.card-content {
  padding: 24px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}

.page-button {
  height: 44px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-weight: normal;
  font-size: 14px;
  color: #111111;
  line-height: 16.8px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: white;
  border: 1px solid rgba(17, 17, 17, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-button:hover {
  background-color: #f9f9f9;
  border-color: rgba(17, 17, 17, 0.3);
}

.page-button.active {
  background-color: rgba(102, 61, 179, 0.06);
  border-color: #663db3;
}

.page-button.active:hover {
  background-color: rgba(102, 61, 179, 0.1);
}

.page-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 61, 179, 0.2);
}

.page-button:active {
  transform: translateY(1px);
}


.accordion-content {
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                padding-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
                 .high-contrast { background-color: #000 !important; color: #FFD700 !important; }
    .invert-colors * { filter: invert(220%); }
    .grayscale * { filter: grayscale(100%) !important; }
    .low-saturation * { filter: contrast(200%) !important; }
    .line-spacing p, .line-spacing li { line-height: 2 !important; }
    .letter-spacing p, .letter-spacing li { letter-spacing: 2px !important; }
    .big-cursor { cursor: url(../icons/icons-icon-img.png), auto !important; }
    .highlight-links a { outline: 2px dashed #f00 !important; background: #ffff99 !important; }
    .skip-link { position: fixed; top: 0px; left: 0; background: #000; color: #fff; padding: 8px; z-index: 10001;  }
    .skip-link:focus { top: 0; }
    .big-buttons button, .big-buttons input[type="submit"], .big-buttons a { transform: scale(1.06); }
    .disable-animation { animation: none !important; transition: none !important; }
    #ariaAlertRegion { position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
  `;

  const style = createEl("style", { innerHTML: css });
  document.head.appendChild(style);

  const toggleBtn = createEl("button", {
    innerText: "🧩 Accessibility",
    id: "accessibilityToggleBtn",
    innerHTML: "🧩 <strong>Accessibility</strong>",
  });
  // Utility to create an element with attributes
  function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") el.className = value;
      else if (key === "innerHTML") el.innerHTML = value;
      else el.setAttribute(key, value);
    });
    children.forEach((child) => el.appendChild(child));
    return el;
  }

  // Function Map
  const optionActions = {
    Blindness: () => toggleReadPage(),
    "Visually Impaired": () => {
      toggleHighContrast();
      increaseFont();
    },
    Cognitive: () => {
      toggleLetterSpacing();
      toggleLineHeight();
    },
    Epilepsy: () =>
      document
        .querySelectorAll("*")
        .forEach((el) => el.classList.toggle("disable-animation")),
    Dyslexia: () => getDyslexiaFont(),
    ADHD: () => {
      toggleReadingLine();
      toggleImages();
    },
    "Text Size": () => increaseFont(),
    "Hide/Show Img": () => toggleImages(),
    "Line Spacing": () => toggleLineHeight(),
    "Letter Spacing": () => toggleLetterSpacing(this),
    "Text Zoom": () => toggleMagnifier(),
    "Enable Skip Link": () => insertSkipLink(),
    "Pause Media": () => pauseStopHideMedia(),
    "Text Alignment": () => toggleTextAlign(),
    "High Contrast": () => toggleHighContrast(),
    "Invert Colors": () => toggleInvert(),
    Grayscale: () => toggleGrayscale(),
    "Low Saturation": () => toggleSaturation(),
    "Reading Line": () => toggleReadingLine(),
    "Highlight Links": () => toggleHighlightLinks(),
    "Big Cursor": () => toggleBigCursor(),
    "Enlarge Buttons": () => toggleEnlargeButtons(),
    "Read Page": () => toggleReadPage(),
    "Virtual Keyboard": () => toggleVirtualKeyboard(),
    "Page Structure": () => getPageStructure(),
    "Image Description": () => toggleAltText(),
  };

  // JSON-driven section config
  const accessibilitySections = [
    {
      id: "profile",
      title: "Profile",
      options: [
        { icon: "../acc-img/frame-4.svg", label: "Blindness" },
        { icon: "../acc-img/frame-10.svg", label: "Visually Impaired" },
        { icon: "../acc-img/frame-7.svg", label: "Cognitive" },
        { icon: "../acc-img/frame-4.svg", label: "Epilepsy" },
        { icon: "../acc-img/svgrepo-iconcarrier.png", label: "Dyslexia" },
        { icon: "../acc-img/SVGRepo_iconCarrier.png", label: "ADHD" },
      ],
    },
    {
      id: "content",
      title: "Content",
      options: [
        {
          icon: "../acc-img/svgrepo-iconcarrier-1.png",
          label: "Text Size",
          variation: true,
          steps: 3,
          stepClass: "font-size-steps",
        },
        { icon: "../acc-img/icon-set.png", label: "Hide/Show Img" },
        {
          icon: "../acc-img/svgrepo-iconcarrier-2.png",
          label: "Line Spacing",
          variation: true,
          steps: 3,
          stepClass: "line-spacing-steps",
        },
        {
          icon: "../acc-img/svgrepo-iconcarrier-3.png",
          label: "Letter Spacing",
          variation: true,
          steps: 3,
          stepClass: "letter-spacing-steps",
        },
        { icon: "../acc-img/frame-3.svg", label: "Text Zoom" },
        { icon: "../acc-img/icon-set.png", label: "Image Description" },
        {
          icon: "../acc-img/svgrepo-iconcarrier-4.png",
          label: "Enable Skip Link",
        },
        { icon: "../acc-img/frame-15.svg", label: "Pause Media" },
        {
          icon: "../acc-img/frame-6.svg",
          label: "Text Alignment",
          variation: true,
          steps: 3,
          stepClass: "text-toggle-steps",
        },
      ],
    },
    {
      id: "color",
      title: "Color & Contrast",
      options: [
        {
          icon: "../acc-img/frame-8.svg",
          label: "High Contrast",
          multiline: true,
        },
        {
          icon: "../acc-img/svgrepo-iconcarrier-6.png",
          label: "Invert Colors",
          multiline: true,
        },
        { icon: "../acc-img/svgrepo-iconcarrier-7.png", label: "Grayscale" },
        {
          icon: "../acc-img/svgrepo-iconcarrier-8.png",
          label: "Low Saturation",
          multiline: true,
        },
      ],
    },
    {
      id: "navigation",
      title: "Navigation",
      options: [
        {
          icon: "../acc-img/frame-1.svg",
          label: "Reading Line",
          multiline: true,
        },
        {
          icon: "../acc-img/svgrepo-iconcarrier-9.png",
          label: "Highlight Links",
          multiline: true,
        },
        {
          icon: "../acc-img/frame-2.svg",
          label: "Big Cursor",
          multiline: true,
        },
        { icon: "../acc-img/frame-2.svg", label: "Big Cursor" },
        { icon: "../acc-img/frame-11.svg", label: "Enlarge Buttons" },
        { icon: "../acc-img/svgrepo-iconcarrier-10.png", label: "Read Page" },
        {
          icon: "../acc-img/svgrepo-iconcarrier-10.png",
          label: "Page Structure",
          cardClass:"page-structure"
        },

        { icon: "../acc-img/frame-14.svg", label: "Virtual Keyboard" ,cardClass:"virtual-keyboad"},
      ],
    },
  ];

  function createOptionCard(option) {
    const label = option.label || "";
    const labelHtml = option.multiline ? label.replace(/ /g, "<br>") : label;

    const card = createEl("div", { class: `option-card ${option.cardClass ? option.cardClass:"" }`});

    // Add icon if provided
    if (option.icon) {
      card.appendChild(
        createEl("img", {
          src: `${option.icon}`,
          alt: label,
          class: "option-icon",
        })
      );
    }

    // Add label
    card.appendChild(
      createEl("div", {
        class: option.multiline ? "option-label multiline" : "option-label",
        innerHTML: labelHtml,
      })
    );

    // Add steps (as empty bullets) only if variation is true and steps is a number
    if (option.variation && typeof option.steps === "number") {
      const stepClass = option.stepClass || ""; // default is no extra class
      const ul = createEl("ul", { class: `option-steps ${stepClass}`.trim() });
      for (let i = 0; i < option.steps; i++) {
        ul.appendChild(createEl("li"));
      }
      card.appendChild(ul);
    }

    // Add onclick handler if available
    card.onclick =
      optionActions[label] || (() => console.warn(`No action for ${label}`));

    return card;
  }

  function createOptionCard1(option) {
    const label = option.label || "";
    // if (option.custom === "adhd") {
    //   const icon = createEl("div", { class: "adhd-icon" }, [
    //     createEl("div", { class: "adhd-bg" }),
    //     createEl("div", { class: "adhd-inner" }),
    //   ]);
    //   return createEl("div", { class: "option-card" }, [
    //     icon,
    //     createEl("div", { class: "option-label", innerHTML: label }),
    //   ]);
    // }
    const labelHtml = option.multiline ? label.replace(/ /g, "<br>") : label;
    const card = createEl("div", { class: `option-card ${option.cardClass}` }, [
      createEl("img", {
        src: `${option.icon}`,
        alt: label,
        class: "option-icon",
      }),
      createEl("div", {
        class: option.multiline ? "option-label multiline" : "option-label",
        innerHTML: labelHtml,
      }),
    ]);
    card.onclick =
      optionActions[label] || (() => console.log(`No action for ${label}`));
    return card;
  }

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  function createAccordionSection(section) {
    const trigger = createEl(
      "button",
      {
        class: "accordion-trigger",
        "data-target": section.id,
      },
      [
        createEl("span", { innerHTML: section.title }),
        createEl("svg", {
          class: "accordion-icon",
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          innerHTML: `<path d='m4.5 6 3 3 3-3' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'/>`,
        }),
      ]
    );

    const content = createEl("div", {
      class: "accordion-content",
      id: section.id,
    });
    const grid = createEl("div", { class: "options-grid" });

    chunkArray(section.options, 3).forEach((row) => {
      const rowEl = createEl("div", { class: "options-row" });
      row.forEach((opt) => rowEl.appendChild(createOptionCard(opt)));
      while (rowEl.children.length < 3)
        rowEl.appendChild(createEl("div", { class: "option-card empty" }));
      grid.appendChild(rowEl);
    });

    content.appendChild(grid);
    const item = createEl("div", { class: "accordion-item-acces" }, [
      trigger,
      content,
    ]);
    return item;
  }
  const panel = createEl("div", { class: "accessibility-panel" });
  const pageList = createEl("div", { id: "pageList" });
  pageList.style.display = "none";
  document.body.append(pageList);
  const header = createEl("div", { class: "panel-header" }, [
    createEl("h1", { innerHTML: "Accessibility" }),
    createEl(
      "button",
      { class: "close-btn", "aria-label": "Close accessibility panel" },
      [
        createEl("img", {
          src: "../acc-img/Frame.png",
        }),
      ]
    ),
  ]);
  function buildAccessibilityPanel() {
    const reset = createEl("div", {
      class: "reset-all",
      innerHTML: "Reset All",
    });
    const scrollArea = createEl("div", { class: "scroll-area" });
    const container = createEl("div", { class: "accordion-container-acces" });
    accessibilitySections.forEach((section) =>
      container.appendChild(createAccordionSection(section))
    );
    scrollArea.appendChild(container);
    scrollArea.appendChild(
      createEl("div", { class: "scrollbar" }, [
        createEl("div", { class: "scrollbar-thumb" }),
      ])
    );

    const content = createEl("div", { class: "panel-content" }, [
      reset,
      scrollArea,
    ]);
    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);
  }

  buildAccessibilityPanel();

  // Append to body
  document.body.append(toggleBtn);

  toggleBtn.onclick = () => {
    const visible = panel.style.display === "block";
    panel.style.display = visible ? "none" : "block";
    // pageList.style.display = visible ? "none" : "block";
  };

  // Auto-label form fields
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (!el.hasAttribute("aria-label") && el.name) {
      el.setAttribute("aria-label", el.name);
    }
  });

  // Add aria live region
  if (!document.getElementById("ariaAlertRegion")) {
    const alertRegion = createEl("div", {
      id: "ariaAlertRegion",
      "aria-live": "polite",
    });
    document.body.appendChild(alertRegion);
  }

  function createThreeStepToggle(options) {
    let currentStep = 0;

    return function toggle() {
      currentStep = (currentStep + 1) % 3;
      options.applyStep(currentStep);

      // Optional: update steps UI if a <ul class="option-steps"> exists
      if (options.stepEl) {
        updateActiveStepIndicator(options.stepEl, currentStep);
      }
    };
  }
  function updateActiveStepIndicator(ulElement, activeIndex) {
    const liItems = ulElement.querySelectorAll("li");
    liItems.forEach((li, index) => {
      li.classList.toggle("active", index === activeIndex);
    });
  }
  const updateFontSizes = (e) => {
    // Cycle through 0 → 3 → 0 again
    fontSizeLevel = (fontSizeLevel + 1) % fontSizeSteps.length;
    const scale = fontSizeSteps[fontSizeLevel];

    document.querySelectorAll("*").forEach((el) => {
      const computedSize = window.getComputedStyle(el).fontSize;

      if (!el.dataset.originalFontSize) {
        el.dataset.originalFontSize = computedSize;
      }

      const originalSize = parseFloat(el.dataset.originalFontSize);
      const newSize = (originalSize * scale) / 100;

      el.style.fontSize = `${newSize}px`;
    });
    const stepUl = document.querySelector(".option-steps");
    if (stepUl) {
      updateActiveStepIndicator(stepUl, fontSizeLevel);
    }
  };

  window.toggleVirtualKeyboard = () => {
    var keyboardWrapper = document.getElementById("keyboardWrapper");
    keyboardWrapper.style.display =
      keyboardWrapper.style.display === "none" ? "block" : "none";





  };

  const toggleTextAlign = createThreeStepToggle({
    applyStep: (step) => {
      const alignments = ["left", "center", "right"];
      document.querySelectorAll("p, h1, h2, h3, li").forEach((el) => {
        el.style.textAlign = alignments[step];
      });
    },
    stepEl: document.querySelector(".text-toggle-steps"), // optional <ul>
  });
  // window.toggleTextAlignment = () => {
  //   const align = alignmentStates[currentAlignmentIndex];

  //   // Remove all previous alignments
  //   document.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
  //     el.style.textAlign = "";
  //   });

  //   // Apply new alignment if not null
  //   if (align) {
  //     document.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
  //       el.style.textAlign = align;
  //     });
  //   }

  //   // Update index for next toggle
  //   currentAlignmentIndex =
  //     (currentAlignmentIndex + 1) % alignmentStates.length;
  // };
  window.increaseFont = (e) => {
    currentFontSize += 10;
    updateFontSizes(e);
  };
  window.decreaseFont = () => {
    currentFontSize = Math.max(70, currentFontSize - 10);
    updateFontSizes();
  };

  window.toggleImages = () => {
    console.log("this");
    document
      .querySelectorAll("img")
      .forEach((img) => (img.style.display = imagesHidden ? "inline" : "none"));
    imagesHidden = !imagesHidden;
  };

  window.toggleAltText = () => {
    document.querySelectorAll("img").forEach((img) => {
      if (altShown && img.alt) {
        const span = createEl("span", {
          className: "img-alt",
          textContent: img.alt,
        });
        img.insertAdjacentElement("afterend", span);
      } else {
        document.querySelectorAll(".img-alt").forEach((el) => el.remove());
      }
    });
    altShown = !altShown;
  };

  const toggleLetterSpacing = createThreeStepToggle({
    applyStep(step) {
      const spacing = ["normal", "0.05em", "0.1em"];
      document.querySelectorAll("p, li, h1, h2").forEach((el) => {
        if (!el.dataset.originalLetterSpacing) {
          const current = window.getComputedStyle(el).letterSpacing;
          el.dataset.originalLetterSpacing = current;
        }
        el.style.letterSpacing = spacing[step];
      });
    },
    stepEl: document.querySelector(".letter-spacing-steps"),
  });

  const toggleLineHeight = createThreeStepToggle({
    applyStep(step) {
      const heights = ["1.4", "1.8", "2.2"];
      document.querySelectorAll("p, li, h1, h2").forEach((el) => {
        if (!el.dataset.originalLineHeight) {
          const current = window.getComputedStyle(el).lineHeight;
          el.dataset.originalLineHeight = current;
        }
        el.style.lineHeight = heights[step];
      });
    },
    stepEl: document.querySelector(".line-spacing-steps"),
  });

  window.insertSkipLink = () => {
    const existingSkipLink = document.querySelector(".skip-link");
    const main = document.querySelector('[data-id="main"]');

    if (!skipLinkEnabled) {
      // Enable Skip Link
      if (!existingSkipLink) {
        const skip = createEl("a", {
          href: "#main",
          class: "skip-link",
          innerHTML: "Skip to main content",
        });
        skip.onfocus = () => (skip.style.top = "0");
        // skip.onblur = () => (skip.style.top = "-40px");
        document.body.prepend(skip);
      }

      if (main) {
        main.setAttribute("tabindex", "-1");
        document.querySelector(".skip-link").addEventListener("click", () => {
          main.focus();
        });
      }

      skipLinkEnabled = true;
    } else {
      // Disable Skip Link
      if (existingSkipLink) {
        existingSkipLink.remove();
      }
      if (main) {
        main.removeAttribute("tabindex");
      }
      skipLinkEnabled = false;
    }

    // Optional ARIA feedback
    const alert = document.getElementById("ariaAlertRegion");
    if (alert) {
      alert.textContent = skipLinkEnabled
        ? "Skip link enabled."
        : "Skip link disabled.";
    }
  };

  window.getDyslexiaFont = () => {
    if (!linkloaded) {
      linkloaded = true;
      const link = document.createElement("link");
      link.id = "opendyslexic-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/opendyslexic@0.1.1/opendyslexic.css";
      document.head.appendChild(link);
      const style = document.createElement("style");
      style.id = "dyslexia-font-style";
      style.innerHTML = `
    .dyslexia-font {
      font-family: 'OpenDyslexic', Arial, Verdana, sans-serif !important;
    }
  `;
      document.head.appendChild(style);
    }
    document.body.classList.toggle("dyslexia-font");
  };

  window.pauseStopHideMedia = () => {
    const pauseStyleId = "pause-css-animations";

    if (!mediaPaused) {
      // Pause all audio/video
      document.querySelectorAll("audio, video").forEach((media) => {
        if (!media.dataset.originalPlaybackState) {
          media.dataset.originalPlaybackState = media.paused
            ? "paused"
            : "playing";
        }
        media.pause();
      });

      // Freeze animated GIFs (reload them)
      document.querySelectorAll('img[src$=".gif"]').forEach((gif) => {
        gif.dataset.originalSrc = gif.src;
        gif.src = "";
        gif.src = gif.dataset.originalSrc;
      });

      // Disable animations and transitions
      if (!document.getElementById(pauseStyleId)) {
        const css = createEl("style", {
          id: pauseStyleId,
          innerHTML:
            "* { animation: none !important; transition: none !important; }",
        });
        document.head.appendChild(css);
      }

      mediaPaused = true;
    } else {
      // Resume media that were playing
      document.querySelectorAll("audio, video").forEach((media) => {
        if (media.dataset.originalPlaybackState === "playing") {
          media.play();
        }
      });

      // Re-enable animations and transitions
      const styleTag = document.getElementById(pauseStyleId);
      if (styleTag) {
        styleTag.remove();
      }

      mediaPaused = false;
    }
  };

  window.toggleHighContrast = () =>
    document.body.classList.toggle("high-contrast");
  window.toggleInvert = () => document.body.classList.toggle("invert-colors");
  window.toggleGrayscale = () => document.body.classList.toggle("grayscale");
  window.toggleSaturation = () =>
    document.body.classList.toggle("low-saturation");
  window.toggleLineSpacing = () =>
    document.body.classList.toggle("line-spacing");
  window.toggleLetterSpacing1 = () =>
    document.body.classList.toggle("letter-spacing");

  window.toggleReadingLine = () => {
    if (!readingLineOn) {
      readingLine = createEl("div", { id: "readingLine" });
      document.body.appendChild(readingLine);
    } else if (readingLine) {
      readingLine.remove();
    }
    readingLineOn = !readingLineOn;
  };

  window.toggleHighlightLinks = () =>
    document.body.classList.toggle("highlight-links");
  window.toggleBigCursor = () => document.body.classList.toggle("big-cursor");
  window.toggleEnlargeButtons = () =>
    document.body.classList.toggle("big-buttons");

  window.toggleReadPage = () => {
    if (window.speechSynthesis) {
      if (speech && window.speechSynthesis.speaking)
        window.speechSynthesis.cancel();
      else {
        speech = new SpeechSynthesisUtterance(document.body.innerText);
        speech.lang = "en-IN";
        window.speechSynthesis.speak(speech);
      }
    }
  };

  window.toggleMagnifier = () => {
    const elements = document.querySelectorAll("p, li, h1, h2, h3, h4, h5");

    if (!magnifierEnabled) {
      elements.forEach((el) => {
        el.style.transition = "transform 0.2s";
        el.addEventListener("mouseover", magnify);
        el.addEventListener("mouseout", resetMagnify);
      });
      magnifierEnabled = true;
    } else {
      elements.forEach((el) => {
        el.removeEventListener("mouseover", magnify);
        el.removeEventListener("mouseout", resetMagnify);
        el.style.transform = "none"; // Reset any existing scale
      });
      magnifierEnabled = false;
    }
  };

  // Helper functions
  function magnify(e) {
    e.target.style.transform = "scale(1.2)";
  }
  function resetMagnify(e) {
    e.target.style.transform = "scale(1)";
  }

  window.getPageStructure = () => {
    const pageList = document.getElementById("pageList");

    if (!pageStrutcutre) {
      function createEl(tag, props = {}) {
        const el = document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
          if (key === "style") {
            Object.assign(el.style, value);
          } else {
            el[key] = value;
          }
        });
        return el;
      }
      const header = createEl("h1", {
        innerText: "Page Structure",
        style: { fontSize: "18px", marginBottom: "10px" },
      });

      // let closeBtn =  createEl(
      //   "button",
      //   { class: "close-btn", "aria-label": "Close accessibility panel" },
      //   [
      //     createEl("img", {
      //      src:"../acc-img/Frame.png",
      //      className:"close-popup",
      //      style: {
      //       cursor: "pointer",
      //       float: "right",
      //       fontWeight: "bold",
      //       color: "#a00",
      //       position:"relative",
      //       top: "-40px",
      //     },
      //     }),
      //   ]
      // ),

      const closeBtn = createEl("img", {
        src: "../acc-img/Frame.png",
        className: "close-popup",
        style: {
          cursor: "pointer",
          float: "right",
          fontWeight: "bold",
          color: "#a00",
          position: "relative",
          top: "-40px",
        },
      });

      closeBtn.onclick = () => {
        document.querySelector('.page-structure').classList.toggle('active')
        pageList.style.display = "none";
      };

      pageList.appendChild(header);
      pageList.appendChild(closeBtn);
      pageList.style.zIndex = "9999";
      pageStrutcutre = true;

      // Sample structure grouped into rows of 2
      const links = Array.from(
        document.querySelectorAll('[data-page-structure="true"]')
      );
      const cardContent = document.createElement("div");
      cardContent.className = "card-content";

      // Group links into chunks of 2
      for (let i = 0; i < links.length; i += 2) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "button-row";

        [links[i], links[i + 1]].forEach((link) => {
          if (link) {
            const btn = document.createElement("a");
            btn.className = "page-button";
            btn.textContent = link.textContent;
            (btn.link = link.href), (btn.target = "_blank");

            rowDiv.appendChild(btn);
          }
        });

        cardContent.appendChild(rowDiv);
      }

      // Append to desired parent, e.g.:
      pageList.appendChild(cardContent);

      // document
      //   .querySelectorAll('[data-page-structure="true"]')
      //   .forEach((link) => {
      //     const a = createEl("a", {
      //       className:"page-button",
      //       href: link.href,
      //       textContent: link.textContent,
      //       target: "_blank",
      //       style: { display: "block"},
      //     });
      //     pageList.appendChild(a);
      //   });
    }
    pageList.style.display =
      pageList.style.display === "none" ? "block" : "none";
  };

  window.resetFontSize = () => {
    document.querySelectorAll("*").forEach((el) => {
      // Reset font size
      if (el.dataset.originalFontSize) {
        el.style.fontSize = "";
        delete el.dataset.originalFontSize;
      }

      // Reset letter spacing
      if (el.dataset.originalLetterSpacing) {
        el.style.letterSpacing = "";
        delete el.dataset.originalLetterSpacing;
      }

      // Reset line height
      if (el.dataset.originalLineHeight) {
        el.style.lineHeight = "";
        delete el.dataset.originalLineHeight;
      }
    });

    // Reset state variables if any
    currentFontSize = 100;

    // Reset active step indicators (bullets)
    document.querySelectorAll(".option-steps li").forEach((li) => {
      li.classList.remove("active");
    });
  };

  window.resetFontSizeqq = () => {
    document.querySelectorAll("*").forEach((el) => {
      if (el.dataset.originalFontSize) {
        el.style.fontSize = ""; // remove inline style
        delete el.dataset.originalFontSize; // remove data attribute
      }
    });
    currentFontSize = 100;
  };

  window.enableVirtualKeyboard = () => {
    // Create keyboard wrapper
    const keyboardWrapper = document.createElement("div");
    keyboardWrapper.className = "keyboardWrapper";
    keyboardWrapper.id = "keyboardWrapper";

    keyboardWrapper.style.position = "fixed";
    keyboardWrapper.style.bottom = "20px"; // margin from bottom
    keyboardWrapper.style.left = "50%";
    keyboardWrapper.style.transform = "translateX(-50%)";
    keyboardWrapper.style.backgroundColor = "#f9f9f9";
    keyboardWrapper.style.border = "2px solid #ccc";
    keyboardWrapper.style.borderRadius = "10px";
    keyboardWrapper.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    keyboardWrapper.style.padding = "20px";
    keyboardWrapper.style.zIndex = "1000";
    keyboardWrapper.style.maxWidth = "600px";
    keyboardWrapper.style.width = "95%";
    keyboardWrapper.style.boxSizing = "border-box";
    keyboardWrapper.style.display = "none";

    const inputWrapper = document.createElement("div");
    inputWrapper.style.display = "flex";
    inputWrapper.style.alignItems = "center";
    inputWrapper.style.justifyContent = "space-between";
    inputWrapper.style.marginBottom = "10px";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.style.marginLeft = "10px";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.border = "none";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#888";
    closeBtn.style.padding = "0 8px";

    closeBtn.onclick = () => {
      
      keyboardWrapper.style.display =
        keyboardWrapper.style.display === "none" ? "block" : "none";

        document.querySelector('.virtual-keyboad').classList.toggle('active')

    };

    inputWrapper.appendChild(closeBtn);
    keyboardWrapper.appendChild(inputWrapper);

    // Create keyboard container
    const keyboardContainer = document.createElement("div");
    keyboardContainer.id = "virtualKeyboard";
    keyboardContainer.style.backgroundColor = "#eee";
    keyboardContainer.style.padding = "10px";
    keyboardContainer.style.display = "inline-block";
    keyboardContainer.style.width = "100%";

    keyboardWrapper.appendChild(keyboardContainer);
    document.body.appendChild(keyboardWrapper);

    // const input = document.getElementById("inputField");
    let isShift = false;

    // Keyboard layout by rows
    const layout = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "@"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Del"],
      ["Shift", "Z", "X", "C", "V", "B", "N", "M", "."],
      ["Space"],
    ];

    layout.forEach((rowKeys) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "center";
      row.style.marginBottom = "5px";

      rowKeys.forEach((key) => {
        const btn = document.createElement("button");
        btn.textContent = key === "Space" ? "␣" : key;
        btn.style.margin = "4px";
        btn.style.padding = "10px 14px";
        btn.style.fontSize = "14px";
        btn.style.minWidth =
          key === "Space" ? "300px" : key.length > 1 ? "70px" : "40px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #aaa";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = "#fff";
        btn.className = "virtual-key";

        // btn.addEventListener("click", () => {
        //   debugger
        //   switch (key) {
        //     case "Del":
        //       input.value = input.value.slice(0, -1);
        //       break;
        //     case "Return":
        //       input.value += "\n";
        //       break;
        //     case "Space":
        //       input.value += " ";
        //       break;
        //     case "Shift":
        //       isShift = !isShift;
        //       updateKeyLabels();
        //       break;
        //     default:
        //       input.value += isShift ? key.toUpperCase() : key.toLowerCase();
        //       if (isShift) {
        //         isShift = false;
        //         updateKeyLabels();
        //       }
        //   }
        //   input.focus();
        // });

        btn.dataset.keyValue = key;
        row.appendChild(btn);
      });

      keyboardContainer.appendChild(row);
    });

    // Toggle case on Shift
    function updateKeyLabels() {
      const allButtons = keyboardContainer.querySelectorAll("button");
      allButtons.forEach((btn) => {
        const key = btn.dataset.keyValue;
        if (key.length === 1 && /[a-z0-9]/i.test(key)) {
          btn.textContent = isShift ? key.toUpperCase() : key.toLowerCase();
        } else if (key === "Space") {
          btn.textContent = "␣";
        } else {
          btn.textContent = key;
        }
      });
    }
  };
  enableVirtualKeyboard();
  window.resetAllAccessibility = () => {
    // Reset font size
    // currentFontSize = 100;
    // updateFontSizes();
    resetFontSize();
    // Show images
    imagesHidden = false;
    document
      .querySelectorAll("img")
      .forEach((img) => (img.style.display = "inline"));

    // Remove alt overlays
    document.querySelectorAll(".img-alt").forEach((el) => el.remove());
    altShown = true;

    // Remove all accessibility-related classes from <body>
    document.body.classList.remove(
      "high-contrast",
      "invert-colors",
      "grayscale",
      "low-saturation",
      "line-spacing",
      "letter-spacing",
      "big-cursor",
      "highlight-links",
      "big-buttons",
      "dyslexia-font"
    );

    // Remove reading line if active
    const rl = document.getElementById("readingLine");
    if (rl) rl.remove();
    readingLineOn = false;

    // Cancel screen reader voice if speaking
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Remove skip link
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) skipLink.remove();

    // Remove CSS that disables animation
    const pauseCSS = document.getElementById("pause-css-animations");
    if (pauseCSS) pauseCSS.remove();

    // Optional: Reset transform zoom effects
    document.querySelectorAll("p, li, h1, h2, h3, h4, h5").forEach((el) => {
      el.style.transform = "none";
      el.onmouseover = null;
      el.onmouseout = null;
    });

    // Optional: Hide page structure and keyboard
    const pageList = document.getElementById("pageList");
    if (pageList) pageList.style.display = "none";

    const keyboardWrapper = document.getElementById("keyboardWrapper");
    if (keyboardWrapper) keyboardWrapper.style.display = "none";
    currentAlignmentIndex = 0;
    document
      .querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, div")
      .forEach((el) => {
        el.style.textAlign = "";
      });
  };
})();
// Accordion functionality
document.addEventListener("DOMContentLoaded", function () {
  let lastFocusedInput = null;
  let isShift = false;

  document.addEventListener("focusin", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable
    ) {
      lastFocusedInput = e.target;
    }
  });
  function insertToActiveInput(char) {
    const el = lastFocusedInput;

    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = el.value;

      let newValue = value;
      let newCaretPos = start;

      if (char === "Del") {
        if (start > 0) {
          newValue = value.slice(0, start - 1) + value.slice(end);
          newCaretPos = start - 1;
        }
      } else if (char === "Space") {
        newValue = value.slice(0, start) + " " + value.slice(end);
        newCaretPos = start + 1;
      } else if (char === "Shift") {
        isShift = !isShift;
        console.log("Shift toggled:", isShift ? "UPPERCASE" : "lowercase");
        return; // Don't insert text for Shift key itself
      } else {
        const finalChar = isShift ? char.toUpperCase() : char.toLowerCase();
        newValue = value.slice(0, start) + finalChar + value.slice(end);
        newCaretPos = start + 1;
      }

      el.value = newValue;
      el.focus();
      el.selectionStart = el.selectionEnd = newCaretPos;

      el.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      console.warn("No input is focused.");
    }
  }


  document.querySelectorAll(".virtual-key").forEach((key) => {
    key.addEventListener("click", () => {
      const char = key.dataset.keyValue;
      insertToActiveInput(char);
    });
  });

  const accordionTriggers = document.querySelectorAll(".accordion-trigger");
  const optionCards = document.querySelectorAll(".option-card:not(.empty)");
  const resetAllBtn = document.querySelector(".reset-all");
  const closeBtn = document.querySelector(".close-btn");

  // Accordion toggle functionality
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const accordionItem = this.closest(".accordion-item-acces");
      const content = document.getElementById(targetId);

      // Toggle active state
      accordionItem.classList.toggle("active");

      // Close other accordion items
      accordionTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          const otherItem = otherTrigger.closest(".accordion-item-acces");
          otherItem.classList.remove("active");
        }
      });
    });
  });

  // Option card click functionality
  optionCards.forEach((card) => {
    card.addEventListener("click", function () {
      if (this)
        // Toggle active state
        this.classList.toggle("active");

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });

    // Add hover effect with sound (optional)
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "";
      }
    });
  });

  // Reset all functionality
  resetAllBtn.addEventListener("click", function () {
    // Remove active state from all option cards
    resetAllAccessibility();
    optionCards.forEach((card) => {
      card.classList.remove("active");
    });

    // Add feedback animation
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
    }, 150);

    console.log("All accessibility options reset");
  });

  // Close button functionality
  closeBtn.addEventListener("click", function () {
    // Add closing animation
    const panel = document.querySelector(".accessibility-panel");
    panel.style.transform = "scale(0.95)";
    // panel.style.opacity = "0";

    setTimeout(() => {
      panel.style.display = "none";
    }, 200);

    console.log("Accessibility panel closed");
  });

  // Keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // Close panel with Escape key
    if (e.key === "Escape") {
      closeBtn.click();
    }

    // Navigate through options with arrow keys
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("option-card")) {
        e.preventDefault();
        const cards = Array.from(optionCards);
        const currentIndex = cards.indexOf(focusedElement);

        let nextIndex;
        if (e.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % cards.length;
        } else {
          nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        }

        cards[nextIndex].focus();
      }
    }

    // Activate option with Enter or Space
    if (e.key === "Enter" || e.key === " ") {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("option-card")) {
        e.preventDefault();
        focusedElement.click();
      }
    }
  });

  // Initialize with first accordion open
  const firstAccordion = document.querySelector(".accordion-item-acces");
  if (firstAccordion) {
    firstAccordion.classList.add("active");
  }

  // Smooth scrolling for scroll area
  const scrollArea = document.querySelector(".scroll-area");
  let isScrolling = false;

  scrollArea.addEventListener("scroll", function () {
    if (!isScrolling) {
      window.requestAnimationFrame(function () {
        // Update custom scrollbar position
        const scrollPercentage =
          scrollArea.scrollTop /
          (scrollArea.scrollHeight - scrollArea.clientHeight);
        const scrollbarThumb = document.querySelector(".scrollbar-thumb");
        const maxTop = scrollArea.clientHeight - 127; // 127px is thumb height
        scrollbarThumb.style.top = scrollPercentage * maxTop + "px";

        isScrolling = false;
      });
    }
    isScrolling = true;
  });

  // Add ripple effect to option cards
  optionCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const ripple = document.createElement("div");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: ${x}px;
              top: ${y}px;
              background: rgba(102, 61, 179, 0.3);
              border-radius: 50%;
              transform: scale(0);
              animation: ripple 0.6s ease-out;
              pointer-events: none;
              z-index: 1;
          `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS animation for ripple effect
  const style = document.createElement("style");
  style.textContent = `
      @keyframes ripple {
          to {
              transform: scale(2);
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(style);
});
