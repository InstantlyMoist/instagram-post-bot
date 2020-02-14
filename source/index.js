const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
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
const Bluebird = require('bluebird');
const inquirer = require('inquirer');
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
    Bluebird.try(async () => {
      const auth = await ig.account.login(credentials.instagram.username, credentials.instagram.password);
      console.log(auth);
      const path = "./memes/meme.jpg";
      console.log('uploading..');
      const publishResult = await ig.publish.photo({
        file: await readFileAsync(path),
        caption: await caption.getCaption(),
      });
    }).catch(IgCheckpointError, async () => {
      await ig.challenge.auto(true);
      const { code } = await inquirer.prompt([
        {
          type: 'input',
          name: 'code',
          message: 'Enter code',
        },
      ]);
      console.log(await ig.challenge.sendSecurityCode(code));
    }).catch(e => console.log('Could not resolve checkpoint:', e, e.stack));
    
  });
};

async function downloadImageFromUrl(url, callback) {
  console.log("Downloading meme");
  let extension = url.endsWith("png") ? "png" : "jpg";
  // console.log("END " + extension);
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
    console.log("Converting meme");
    image.scaleToFit(512, 512).write("./memes/meme.jpg");
    console.log("done 1");
  });
}

schedule.scheduleJob('*/5 * * * *', () => {
  let delay = (random.int(0, 2) * 1000);
  console.log('De post wordt geplaatst over: ' + delay);
  setTimeout(uploadPost, delay);
});

