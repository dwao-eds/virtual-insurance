import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const subHeaderMeta = getMetadata('sub');
  const subHeaderPath = subHeaderMeta ? new URL(subHeaderMeta, window.location).pathname : '/sub';
  try {
    const subHeaderFragment = await loadFragment(subHeaderPath);
    if (subHeaderFragment && subHeaderFragment.firstElementChild) {
      const subHeader = document.createElement('div');
      subHeader.classList.add('subheader-wrapper');
      while (subHeaderFragment.firstElementChild) {
        subHeader.append(subHeaderFragment.firstElementChild);
      }
      const liElements = subHeader.querySelectorAll('li');
      liElements.forEach((li) => {
        li.classList.add('subheader-list');
      });
      block.textContent = '';
      block.append(subHeader);
    } else {
      console.error('Subheader fragment is empty or malformed.');
    }
  } catch (error) {
    console.error('Error fetching or loading subheader fragment:', error);
  }
}
