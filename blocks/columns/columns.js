import { createOptimizedPicture } from "../../scripts/aem.js";
// import { moveInstrumentation } from "../../scripts/scripts.js";


export default function decorate(block) {
  let newImg="";
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const btn = document.querySelectorAll('.button');
      btn.forEach((btn)=>btn.setAttribute("target","_blank"));
      if (pic) {
        const img=col.querySelector("picture > img");
        const optimizedPic = createOptimizedPicture(img.src, img.alt, true, [
          { width: "750" },
        ]);
        // moveInstrumentation(img, optimizedPic.querySelector("img"));
        img.closest("picture").replaceWith(optimizedPic);
        newImg = optimizedPic
          .querySelector("picture > img")
          .getAttribute("src");
        
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
