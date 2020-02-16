const fetch = require('node-fetch');
const tags = "#dankmemes #memes #funny #laughing #fortnite #minecraft #roblox #tiktok #followme #likeforlike #like4like #follow4follow #followforfollow #f4f";

module.exports = {
    getCaption: getCaption
}

async function getCaption() {
    let response = await fetch('https://api.quotable.io/random/');
    let data = await response.json();
    const caption = data.content;
    return `
    ⠀
    "${caption}"⁣⠀
    ⠀
    ⁣----------⠀
    ⁣${tags}
    `;
}