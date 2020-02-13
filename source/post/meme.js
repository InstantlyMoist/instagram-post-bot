const fetch = require('node-fetch');
const posted = require('../../memes/posted/uploaded.json');
const fs = require('fs');

module.exports = {
    getMemeJSON: getMemeJSON
}

async function getMemeJSON() {
    let response = await fetch('http://meme-api.herokuapp.com/gimme/dankmemes');
    let data = await response.json();
    let toReturn;

    await beenPosted(data.postLink).then((posted) => {
        console.log("posted " + posted);
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
    fs.writeFile("memes/posted/uploaded.json", JSON.stringify(json), (err) => {
        console.log('updating json file');
        if (err) throw err;
    });
}

async function beenPosted(postIdentifier) {
    const id = postIdentifier.split("https://redd.it/")[1];
    let returnable = false;

    if (posted.posts.length == 0) return returnable;
    posted.posts.forEach(element => {
        if (element === id) {
            returnable = true;
            console.log('DUPLICATE FOUND NIBBA');
            return;
        }
    });
    console.log("OK");
    return returnable;
}