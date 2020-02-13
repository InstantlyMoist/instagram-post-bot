const { IgApiClient } = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
const { sample } = require('lodash');
const schedule = require('node-schedule');
const readFileAsync = promisify(readFile);
const random = require('random');
const meme = require('./post/meme.js');
const request = require('request');
const fs = require('fs');

const credentials = require('./credentials.json');

async function uploadPost() {
  let newMeme = await meme.getMemeJSON();
  downloadImageFromUrl(newMeme.url, (success) => {
    if (!success) {
      uploadPost();
      return;
    };
    console.log(newMeme.title);
    /*const ig = new IgApiClient();
    ig.state.generateDevice(credentials.instagram.username);
    await ig.qe.syncLoginExperiments();
    const loggedInUser = await ig.account.login(credentials.instagram.username, credentials.instagram.password);
    const path = './assets/smiley.jpg';
    const publishResult = await ig.publish.photo({
      file: await readFileAsync(path),
      caption: '<3',
    });*/
  });
};

uploadPost();

async function downloadImageFromUrl(url, callback) {
  request.head(url, (err, body) => {
    if (err) return callback(false);
    request(url).pipe(fs.createWriteStream("./memes/meme.jpg")).on('close', () => {
      return callback(true)
    });
  })
}

schedule.scheduleJob('* 0 * * *', () => {
  let delay = (random.int(0, 10) * 1000);
  console.log('De post wordt geplaatst om: ' + delay);
  setTimeout(delay, uploadPost());
});

