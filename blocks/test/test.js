console.log("test.js is loaded");

export default function decorate(block){
    console.log(block);
     const cols = [...block.firstElementChild.children];
    block.classList.add(`testing_main_div`);

    // const divs = block.querySelectorAll('div');
    // console.log(divs);

    // divs.forEach((div, index) => {
    //     console.log(div);
    //     const className = `unique-class-${index + 1}`;
    //     div.classList.add(className);
    // });

    // console.log(block);
    const divs = block.querySelectorAll('div');
    divs.forEach((div, index) => {
        // Select all <p> tags inside the current div
        const paragraphs = div.querySelectorAll('p');
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapper-div');
        for (let i = 0; i < paragraphs.length; i += 2) {
            const pairDiv = document.createElement('div');
            pairDiv.classList.add('pair-div');
            pairDiv.appendChild(paragraphs[i].cloneNode(true));
            if (i + 1 < paragraphs.length) {
                pairDiv.appendChild(paragraphs[i + 1].cloneNode(true));
            }
            wrapperDiv.appendChild(pairDiv);
        }
        div.innerHTML = '';
        div.appendChild(wrapperDiv);
    });
}