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

  const createEl = (tag, props = {}, styles = {}, children = []) => {
    const el = document.createElement(tag);
    Object.assign(el, props);
    Object.assign(el.style, styles);
    children.forEach((child) => el.appendChild(child));
    return el;
  };

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
    #accessibilityPanel, #pageList {
      position: fixed !important;
      bottom: 50px;
      left: 20px;
      width: 340px;
      max-height: 90vh;
      overflow-y: auto;
      background: #f9f9f9;
      border-radius: 12px;
      padding: 16px;
      font-family: sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      z-index: 9998;
      display:none;
    }
    #accessibilityPanel button {
      margin: 2px 0 5px;
      padding: 4px 8px;
      font-size: 10px;
    }
    .high-contrast { background-color: #000 !important; color: #FFD700 !important; }
    .invert-colors * { filter: invert(220%); }
    .grayscale * { filter: grayscale(100%) !important; }
    .low-saturation * { filter: contrast(200%) !important; }
    .line-spacing p, .line-spacing li { line-height: 2 !important; }
    .letter-spacing p, .letter-spacing li { letter-spacing: 2px !important; }
    .big-cursor { cursor: url('https://example.com/cursor.png'), auto !important; }
    .highlight-links a { outline: 2px dashed #f00 !important; background: #ffff99 !important; }
    .skip-link { position: absolute; top: 0px; left: 0; background: #000; color: #fff; padding: 8px; z-index: 10001;  }
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
  });
  const panel = createEl("div", { id: "accessibilityPanel" });
  const pageList = createEl("div", { id: "pageList" });
  pageList.style.display = "none";

  const sections = [
    {
      title: "🔁 Reset",
      buttons: [{ text: "Reset All", fn: () => resetAllAccessibility() }],
    },
    {
      title: "🧠 Profiles",
      buttons: [
        { text: "Blindness", fn: () => toggleReadPage() },
        {
          text: "Visually Impaired",
          fn: () => {
            toggleHighContrast();
            increaseFont();
          },
        },
        {
          text: "Cognitive",
          fn: () => {
            toggleLetterSpacing();
            toggleLineSpacing();
          },
        },
        {
          text: "Epilepsy",
          fn: () =>
            document
              .querySelectorAll("*")
              .forEach((el) => el.classList.toggle("disable-animation")),
        },
        {
          text: "ADHD",
          fn: () => {
            toggleReadingLine();
            toggleImages();
          },
        },
        {
          text: "Dyslexia",
          fn: () => {
            getDyslexiaFont();
          },
        },
      ],
    },
    {
      title: "📚 Content",
      buttons: [
        { text: "A+", fn: () => increaseFont() },
        { text: "A−", fn: () => decreaseFont() },
        { text: "🖼️ Hide/Show Img", fn: () => toggleImages() },
        { text: "📝 Image Descriptions", fn: () => toggleAltText() },
        { text: "📏 Adjust Line Spacing", fn: () => toggleLineSpacing() },
        { text: "🔡 Adjust Letter Spacing", fn: () => toggleLetterSpacing() },
        { text: "🔡 Text Zoom", fn: () => toggleMagnifier() },
        { text: "📜 Enable Skip Link", fn: () => insertSkipLink() },
        { text: "🛑 Pause Media/Animations", fn: () => pauseStopHideMedia() },
      ],
    },
    {
      title: "🎨 Colors & Contrast",
      buttons: [
        { text: "High Contrast", fn: () => toggleHighContrast() },
        { text: "Invert Colors", fn: () => toggleInvert() },
        { text: "Grayscale", fn: () => toggleGrayscale() },
        { text: "Low Saturation", fn: () => toggleSaturation() },
      ],
    },
    {
      title: "🧭 Navigation",
      buttons: [
        { text: "📖 Reading Line", fn: () => toggleReadingLine() },
        { text: "🔗 Highlight Links", fn: () => toggleHighlightLinks() },
        { text: "🖱️ Big Cursor", fn: () => toggleBigCursor() },
        { text: "🔲 Enlarge Buttons", fn: () => toggleEnlargeButtons() },
        { text: "🔊 Read Page", fn: () => toggleReadPage() },
        { text: "Page Structure", fn: () => getPageStructure() },
        { text: "Virtual Keyboard", fn: () => toggleVirtualKeyboard() },
      ],
    },
  ];

  // Build panel content
  sections.forEach(({ title, buttons }) => {
    panel.appendChild(createEl("h3", { innerText: title }));
    buttons.forEach(({ text, fn }) => {
      const btn = createEl("button", { innerText: text });
      btn.onclick = fn;
      panel.appendChild(btn);
    });
  });

  // Append to body
  document.body.append(toggleBtn, panel, pageList);

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

  const updateFontSizes = () => {
    document.querySelectorAll("*").forEach((el) => {
      const computedSize = window.getComputedStyle(el).fontSize;
      if (!el.dataset.originalFontSize) {
        el.dataset.originalFontSize = computedSize;
      }

      const originalSize = parseFloat(el.dataset.originalFontSize);
      const newSize = (originalSize * currentFontSize) / 100;
      el.style.fontSize = `${newSize}px`;
    });
  };
  window.toggleVirtualKeyboard = () => {
    debugger;
    var keyboardWrapper = document.getElementById("keyboardWrapper");
    keyboardWrapper.style.display =
      keyboardWrapper.style.display === "none" ? "block" : "none";
  };

  window.increaseFont = () => {
    currentFontSize += 10;
    updateFontSizes();
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

  window.insertSkipLink = () => {
    const existingSkipLink = document.querySelector(".skip-link");
    const main = document.querySelector('[data-id="main"]');

    if (!skipLinkEnabled) {
      // Enable Skip Link
      if (!existingSkipLink) {
        const skip = createEl("a", {
          href: "#main",
          className: "skip-link",
          textContent: "Skip to main content",
        });
        skip.onfocus = () => (skip.style.top = "0");
        skip.onblur = () => (skip.style.top = "-40px");
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
  window.toggleLetterSpacing = () =>
    document.body.classList.toggle("letter-spacing");

  window.toggleReadingLine = () => {
    if (!readingLineOn) {
      readingLine = createEl(
        "div",
        { id: "readingLine" },
        {
          position: "fixed",
          height: "2px",
          width: "100%",
          background: "red",
          top: "50%",
          left: "0",
          zIndex: "10000",
          pointerEvents: "none",
        }
      );
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
    debugger;
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
      const closeBtn = createEl("span", {
        innerText: "X",
        className: "close-popup",
        style: {
          cursor: "pointer",
          float: "right",
          fontWeight: "bold",
          color: "#a00",
        },
      });

      closeBtn.onclick = () => {
        pageList.style.display = "none";
      };

      pageList.appendChild(header);
      pageList.appendChild(closeBtn);

      pageStrutcutre = true;
      document
        .querySelectorAll('[data-page-structure="true"]')
        .forEach((link) => {
          const a = createEl("a", {
            href: link.href,
            textContent: link.textContent,
            target: "_blank",
            style: { display: "block", margin: "4px 0" },
          });
          pageList.appendChild(a);
        });
    }
    pageList.style.display =
      pageList.style.display === "none" ? "block" : "none";
  };

  window.resetFontSize = () => {
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

    const inputFired = document.createElement("input");
    inputFired.id = "inputField";
    inputFired.type = "text";
    inputFired.style.fontSize = "16px";
    inputFired.style.width = "100%";
    inputFired.style.padding = "5px";
    inputFired.style.flex = "1";

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
    };

    inputWrapper.appendChild(inputFired);
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

    const input = document.getElementById("inputField");
    let isShift = false;

    // Keyboard layout by rows
    const layout = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Del"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Return"],
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

        btn.addEventListener("click", () => {
          switch (key) {
            case "Del":
              input.value = input.value.slice(0, -1);
              break;
            case "Return":
              input.value += "\n";
              break;
            case "Space":
              input.value += " ";
              break;
            case "Shift":
              isShift = !isShift;
              updateKeyLabels();
              break;
            default:
              input.value += isShift ? key.toUpperCase() : key.toLowerCase();
              if (isShift) {
                isShift = false;
                updateKeyLabels();
              }
          }
          input.focus();
        });

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
  };
})();
