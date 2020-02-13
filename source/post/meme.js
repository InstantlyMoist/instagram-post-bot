let http = require('http');

module.exports = {
    getMemeJSON: getMemeJSON
}

async function getMemeJSON(callback) {
    http.get('http://meme-api.herokuapp.com/gimme/dankmemes', (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
            return callback(JSON.parse(data));
        });
    });
}