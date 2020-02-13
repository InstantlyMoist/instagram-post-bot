const fetch = require('node-fetch');
const posted = require('../posted/uploaded.json');
const fs = require('fs');

module.exports = {
    getMemeJSON: getMemeJSON
}

async function getMemeJSON() {
    let response = await fetch('http://meme-api.herokuapp.com/gimme/dankmemes');
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
    console.log('saving post');
    let json = posted;
    json.posts.push(postIdentifier);
    fs.writeFile("source/posted/uploaded.json", JSON.stringify(json), (err) => {
        if (err) throw err;
    });
}

async function beenPosted(postIdentifier) {
    let returnable = false;

    if (posted.posts.length == 0) return returnable;
    posted.posts.forEach(element => {
        if (element === postIdentifier) {
            returnable = true;
            return;
        }
    });
    return returnable;
}