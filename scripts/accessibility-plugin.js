
(function () {
  const body = document.body;

  // Floating button
  const toggleBtn = document.createElement('button');
  toggleBtn.innerText = '🧩 Accessibility';
  toggleBtn.id = 'accessibilityToggleBtn';
  toggleBtn.style.cssText = `
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
  `;

  // Plugin Panel
  const panel = document.createElement('div');
  panel.id = 'accessibilityPanel';
  panel.style.cssText = `
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
    display: none;
    z-index: 9998;
  `;

  panel.innerHTML = `
    <h2>🧩 Accessibility Options</h2>

    <h3>🧠 Profiles</h3>
    <button onclick="applyProfile('blind')">Blindness</button>
    <button onclick="applyProfile('visual')">Visually Impaired</button>
    <button onclick="applyProfile('cognitive')">Cognitive</button>
    <button onclick="applyProfile('epilepsy')">Epilepsy</button>
    <button onclick="applyProfile('adhd')">ADHD</button>

    <h3>📚 Content</h3>
    <button onclick="increaseFont()">A+</button>
    <button onclick="decreaseFont()">A−</button>
    <button onclick="toggleImages()">🖼️ Hide/Show Img</button>
    <button onclick="toggleAltText()">📝 Image Descriptions</button>
    <button onclick="toggleLineSpacing()">📏 Adjust Line Spacing</button>
    <button onclick="toggleLetterSpacing()">🔡 Adjust Letter Spacing</button>

    <h3>🎨 Colors & Contrast</h3>
    <button onclick="toggleHighContrast()">High Contrast</button>
    <button onclick="toggleInvert()">Invert Colors</button>
    <button onclick="toggleGrayscale()">Grayscale</button>
    <button onclick="toggleSaturation()">Low Saturation</button>

    <h3>🧭 Navigation</h3>
    <button onclick="toggleReadingLine()">📖 Reading Line</button>
    <button onclick="toggleHighlightLinks()">🔗 Highlight Links</button>
    <button onclick="toggleBigCursor()">🖱️ Big Cursor</button>
    <button onclick="toggleEnlargeButtons()">🔲 Enlarge Buttons</button>
    <button onclick="toggleReadPage()">🔊 Read Page</button>
  `;

const buttons = panel.querySelectorAll('button');
buttons.forEach(button => {
  button.style.margin = '2px';
  button.style.marginBottom ='5px'
  button.style.padding = '4px 8px';
  button.style.fontSize = '10px';
});

  document.body.appendChild(toggleBtn);
  document.body.appendChild(panel);

  toggleBtn.onclick = () => {
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
  };

  // Functional states
  let currentFontSize = 100;
  let imagesHidden = false;
  let altShown = true;
  let highContrast = false;
  let readingLine;
  let readingLineOn = false;
  let letterSpaced = false;
  let lineSpaced = false;
  let bigCursor = false;
  let buttonsEnlarged = false;
  let speech;

  // Font controls
 const elements = [];

  // Wait until DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Select all elements
    document.querySelectorAll('*').forEach(el => {
      const computedSize = parseFloat(window.getComputedStyle(el).fontSize);
      if (computedSize && !el.dataset.originalFontSize) {
        el.dataset.originalFontSize = computedSize;
        elements.push(el);
      }
    });
  });

  function updateFontSizes() {
    elements.forEach(el => {
      const originalSize = parseFloat(el.dataset.originalFontSize);
      if (originalSize) {
        el.style.fontSize = (originalSize * currentFontSize / 100) + 'px';
      }
    });
  }

  window.increaseFont = () => {
    currentFontSize += 10;
    updateFontSizes();
  };

  window.decreaseFont = () => {
    currentFontSize = Math.max(70, currentFontSize - 10);
    updateFontSizes();
  };

  // Toggle images
  window.toggleImages = () => {
    document.querySelectorAll('img').forEach(img => {
      img.style.display = imagesHidden ? 'inline' : 'none';
    });
    imagesHidden = !imagesHidden;
  };

  // Alt text
  window.toggleAltText = () => {
    document.querySelectorAll('img').forEach(img => {
      if (altShown) {
        if (img.alt) {
          const span = document.createElement('span');
          span.className = 'img-alt';
          span.textContent = img.alt;
          img.parentNode.insertBefore(span, img.nextSibling);
        }
      } else {
        document.querySelectorAll('.img-alt').forEach(e => e.remove());
      }
    });
    altShown = !altShown;
  };

  // Contrast and color
  window.toggleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  };
  window.toggleInvert = () => {
    document.body.classList.toggle('invert-colors');
  };
  window.toggleGrayscale = () => {
    document.body.classList.toggle('grayscale');
  };
  window.toggleSaturation = () => {
    document.body.classList.toggle('low-saturation');
  };

  // Spacing
  window.toggleLineSpacing = () => {
    document.body.classList.toggle('line-spacing');
    lineSpaced = !lineSpaced;
  };
  window.toggleLetterSpacing = () => {
    document.body.classList.toggle('letter-spacing');
    letterSpaced = !letterSpaced;
  };

  // Navigation
  window.toggleReadingLine = () => {
    if (!readingLineOn) {
      readingLine = document.createElement('div');
      readingLine.id = 'readingLine';
      readingLine.style.cssText = `
        position: fixed;
        height: 2px;
        width: 100%;
        background: red;
        top: 50%;
        left: 0;
        z-index: 10000;
        pointer-events: none;
      `;
      document.body.appendChild(readingLine);
    } else {
      if (readingLine) readingLine.remove();
    }
    readingLineOn = !readingLineOn;
  };

  window.toggleHighlightLinks = () => {
    document.querySelectorAll('a').forEach(a => {
      a.style.outline = a.style.outline ? '' : '2px dashed orange';
    });
  };

  window.toggleBigCursor = () => {
    document.body.style.cursor = bigCursor ? '' : 'url(./icons/icons8-cursor-50.png), auto';
    bigCursor = !bigCursor;
  };

  window.toggleEnlargeButtons = () => {
  document.body.classList.toggle('big-buttons');
  };

  // Screen reader
  window.toggleReadPage = () => {
    if (window.speechSynthesis) {
      if (speech && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        speech = new SpeechSynthesisUtterance(document.body.innerText);
        speech.lang = 'en-IN';
        window.speechSynthesis.speak(speech);
      }
    }
  };

  // Profiles
  window.applyProfile = (profile) => {
    if (profile === 'blind') toggleReadPage();
    if (profile === 'visual') { toggleHighContrast(); increaseFont(); }
    if (profile === 'cognitive') { toggleLetterSpacing(); toggleLineSpacing(); }
    if (profile === 'epilepsy') document.querySelectorAll('*').forEach(el => el.classList.toggle('disable-animation'));
    if (profile === 'adhd') { toggleReadingLine(); toggleImages(); }
  };

})();



// --- Additional UI and interaction enhancements --- //

window.toggleTextAlign = function (alignType) {
  document.body.style.textAlign = alignType;
};

window.toggleMagnifier = function () {
  document.querySelectorAll('p, li, h1, h2, h3, h4, h5').forEach(el => {
    el.addEventListener('mouseover', () => el.style.transform = 'scale(1.2)');
    el.addEventListener('mouseout', () => el.style.transform = 'scale(1)');
    el.style.transition = 'transform 0.2s';
  });
};

window.toggleReadingMask = function () {
  let mask = document.getElementById('readingMask');
  if (mask) {
    mask.remove();
  } else {
    const div = document.createElement('div');
    div.id = 'readingMask';
    div.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      pointer-events: none;
      z-index: 9996;
    `;
    document.body.appendChild(div);
  }
};

window.highlightHeadings = function () {
  document.querySelectorAll('h1, h2, h3, h4, h5').forEach(el => {
    el.style.background = 'yellow';
    el.style.border = '2px dashed #000';
  });
};

window.showPageStructure = function () {
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(h => h.style.outline = '2px solid red');
  const links = document.querySelectorAll('a');
  links.forEach(a => a.style.outline = '2px dotted blue');
};

window.insertSkipLink = function () {
  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.href = '#main';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    skip.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 10001;
    `;
    document.body.insertBefore(skip, document.body.firstChild);
  }
};

window.insertSkipLink();

window.toggleColorSwatch = function(type) {
  const bg = type === 'dark' ? '#000' : '#fff';
  const color = type === 'dark' ? '#fff' : '#000';
  document.body.style.background = bg;
  document.body.style.color = color;
};

window.triggerTimeoutWarning = function () {
  setTimeout(() => {
    alert('Session will expire soon due to inactivity. Please interact to continue.');
  }, 5000);
};

window.activateDictionary = function () {
  document.addEventListener('mouseup', () => {
    const text = window.getSelection().toString();
    if (text.length > 3) {
      alert('Selected word: "' + text + '"\n(Dictionary: feature placeholder)');
    }
  });
};

window.enableVirtualKeyboard = function () {
  alert("Virtual keyboard integration placeholder. Use browser plugin for now.");
};



// Aliases and Enhancements

// Alias for enlargeButtons
// window.enlargeButtons = toggleEnlargeButtons;

// Alias for highlightLinks
window.highlightLinks = toggleHighlightLinks;

// Add aria-live to alert region if missing
if (!document.getElementById('ariaAlertRegion')) {
  const alertRegion = document.createElement('div');
  alertRegion.id = 'ariaAlertRegion';
  alertRegion.setAttribute('aria-live', 'polite');
  alertRegion.style.cssText = 'position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden;';
  document.body.appendChild(alertRegion);
}

// Auto-inject aria-labels for form inputs if not labeled
document.querySelectorAll('input, textarea, select').forEach(el => {
  if (!el.hasAttribute('aria-label') && el.name) {
    el.setAttribute('aria-label', el.name);
  }
});

const style = document.createElement('style');
style.innerHTML = `
/* Color and Contrast */
.high-contrast {
  background-color: #000 !important;
  color: #FFD700 !important;
}

.invert-colors *{
   filter: saturate(30%) !important; 
}
.grayscale *{
  filter: grayscale(100%) !important;
}
.low-saturation *{
  filter: saturate(30%) !important;
}

/* Spacing */
.line-spacing p, .line-spacing li {
  line-height: 2 !important;
}
.letter-spacing p, .letter-spacing li {
  letter-spacing: 2px !important;
}

/* Big Cursor */
.big-cursor {
  cursor: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFLKwqYzudtbbrkofsTtn_b7vkbeeOdFM3WdCFtKLrc71SwDKiPQx3n1DCVUH9PggNIdo&usqp=CAU'), auto !important;
}

/* Enlarged Buttons */
.enlarge-buttons button {
  font-size: 1.25em !important;
  padding: 1em 1.5em !important;
}

/* Highlight Links */
.highlight-links a {
  outline: 2px dashed #f00 !important;
  background: #ffff99 !important;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 10001;
      display: none;
}
.skip-link:focus {
  top: 0;
}

.big-buttons button, .big-buttons input[type="submit"], .big-buttons a{
  transform: scale(1.06);
}

.disable-animation{
  }
`;
document.head.appendChild(style);