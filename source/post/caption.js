const fetch = require('node-fetch');
const tags = "#dankmemes #memes #funny #laughing #fortnite #minecraft #roblox #tiktok #nature #likeforlikes #tbt #photooftheday #meme #dank";

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