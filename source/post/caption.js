const fetch = require('node-fetch');
const tags = "#dankmemes #memes #funny #laughing #fortnite #minecraft #roblox #tiktok";

module.exports = {
    getCaption: getCaption
}

async function getCaption() {
    let response = await fetch('https://corporatebs-generator.sameerkumar.website/');
    let data = await response.json();
    const caption = data.phrase;
    return `
        "${caption}"⁣
        ⁣---------- 
        ⁣${tags}
    `;
}