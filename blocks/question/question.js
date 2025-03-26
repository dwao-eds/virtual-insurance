export default async function decorate(block) {
  block.classList.add('parent-div');
  const contentDiv = block.querySelector('div > p').parentNode;
  contentDiv.classList.add('content-div');
  const pictureDiv = block.querySelector('div > picture').parentNode;
  pictureDiv.classList.add('picture-div');

  const firstPTag = contentDiv.querySelector('p');
  if (firstPTag) {
    const h2Tag = document.createElement('h2');
    h2Tag.classList.add('heading-label');
    h2Tag.textContent = firstPTag.textContent;
    firstPTag.parentNode.replaceChild(h2Tag, firstPTag);
  }
  [...block.children].forEach((qWrap) => {
    qWrap.classList.add('q-wrap');
    [...qWrap.querySelectorAll('p')].forEach((p, i) => {
      const uniqueClassName = `label-text-${i}`;
      p.classList.add(uniqueClassName);
    });
  });
}
