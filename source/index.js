const { IgApiClient } = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
const { sample } = require('lodash');
const schedule = require('node-schedule');
const readFileAsync = promisify(readFile);
const random = require('random');
const meme = require('./post/meme.js');
const caption = require('./post/caption.js');
const request = require('request');
const fs = require('fs');
const Jimp = require("jimp");

const credentials = require('./credentials.json');

async function uploadPost() {
  console.log('uploading');
  
  let newMeme = await meme.getMemeJSON();
  downloadImageFromUrl(newMeme.url, async (success) => {
    if (!success) {
      uploadPost();
      return;
    };
    const ig = new IgApiClient();
    ig.state.generateDevice(credentials.instagram.username);
    await ig.qe.syncLoginExperiments();
    const loggedInUser = await ig.account.login(credentials.instagram.username, credentials.instagram.password);
    const path = "./memes/meme.jpg";
    console.log('uploading..');
    const publishResult = await ig.publish.photo({
      file: await readFileAsync(path),
      caption: await caption.getCaption(),
    });
  });
};

uploadPost();

async function downloadImageFromUrl(url, callback) {
  console.log("downloading");
  let extension = url.endsWith("png") ? "png" : "jpg";
  console.log("END " + extension);
  request.head(url, (err, body) => {
    if (err) return callback(false);
    request(url).pipe(fs.createWriteStream(`./memes/meme.${extension}`)).on('close', () => {
      if (extension === "jpg") return callback(true)
      else {
        convertMeme();
        return callback(true);
      }
    })
  })
}

async function convertMeme() {
  Jimp.read("./memes/meme.png", function(err, image) {
    console.log("converting");
    image.scaleToFit(512, 512).write("./memes/meme.jpg");
    console.log("done 1");
  });
}

schedule.scheduleJob('* 0 * * *', () => {
  let delay = (random.int(0, 10) * 1000);
  console.log('De post wordt geplaatst om: ' + delay);
  setTimeout(delay, uploadPost());
});

