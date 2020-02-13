const fetch = require('node-fetch');
const tags = "<3";

module.exports = {
    getCaption: getCaption
}

async function getCaption() {
    let response = await fetch('https://corporatebs-generator.sameerkumar.website/');
    let data = await response.json();
    const caption = data.phrase;
    return `
        "${caption}"⁣\n
        ⁣----------\n
        ⁣${tags}
    `;
}