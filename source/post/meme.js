const fetch = require('node-fetch');
const posted = require('../../memes/posted/uploaded.json');
const fs = require('fs');

module.exports = {
    getMemeJSON: getMemeJSON
}

async function getMemeJSON() {
    let response = await fetch('http://meme-api.herokuapp.com/gimme');
    let data = await response.json();
    let toReturn;

    await beenPosted(data.postLink).then((posted) => {
        if (posted) toReturn = getMemeJSON();
        else {
            toReturn = data;
            savePost(data.postLink);
        }
    });
    return toReturn
}

async function savePost(postIdentifier) {
    const id = postIdentifier.split("https://redd.it/")[1];
    let json = posted;

    json.posts.push(id);
    fs.writeFile("./memes/posted/uploaded.json", JSON.stringify(json), (err) => {
        if (err) throw err;
    });
}



async function beenPosted(postIdentifier) {
    const id = postIdentifier.split("https://redd.it/")[1];
    return posted.posts.includes(id);
}