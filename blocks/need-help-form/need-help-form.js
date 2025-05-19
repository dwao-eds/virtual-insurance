
console.log("Need Help Form js is loaded");
export default async function decorate(block){
    console.log(block);

    const paypremiumBlock = block.querySelector('.block');
    const firstDiv = paypremiumBlock.querySelector('div');
    const formWrapper = document.querySelector('.form-wrapper');
    firstDiv.appendChild(formWrapper);

}