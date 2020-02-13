let http = require('http');
let posted = require('../posted/uploaded.json');

module.exports = {
    getMemeJSON: getMemeJSON
}

async function getMemeJSON() {
    return new Promise(resolve => {
    http.get('http://meme-api.herokuapp.com/gimme/dankmemes', (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
            beenPosted("x").then((posted) => {
                if (posted) return resolve(JSON.parse(data));
                else return resolve(getMemeJSON());
            });
        });
    })});


}

async function beenPosted(postIdentifier) {
    let returnable = false;
    posted.posts.forEach(element => {
        if (element === postIdentifier) {
            returnable = true;
            return;
        }
    });
    return Promise.resolve(returnable);
}