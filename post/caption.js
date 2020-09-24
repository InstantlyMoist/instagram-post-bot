const fetch = require('node-fetch');
const tags = "#dankmemes #memes #funny #laughing #tiktok #nature #likeforlikes #likeforlike #l4l #meme #dank";

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