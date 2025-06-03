/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${summary.innerHTML}</p>`;
    }

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (!hasWrapper(body)) {
      body.innerHTML = `<p>${body.innerHTML}</p>`;
    }

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    if (index === 0) {
      details.open = true; // Open the first accordion by default
    }
    details.append(summary, body);
    details.addEventListener('click', () => {
      [...block.children].forEach((otherRow, otherIndex) => {
        if (otherIndex !== index) {
          otherRow.removeAttribute('open');
        }
      });
    });
    row.replaceWith(details);
  });
}
