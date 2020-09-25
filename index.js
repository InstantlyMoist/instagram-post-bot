const path = require('path');
global.appRoot = path.resolve(__dirname);

const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
const { readFile } = require('fs');
const { promisify } = require('util');
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
const { createCanvas, loadImage } = require('canvas')
var https = require('https');
var http = require('http');
const express = require('express');
const app = express();


const ig = new IgApiClient();
login();

let loggedIn = false;

app.get('/instagram/forcepost', (req, res) => {
  res.send(JSON.stringify({
    status: "OK"
  }))
  uploadPost();
});

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/kyllian.nl/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/kyllian.nl/cert.pem')
};

http.createServer(app).listen(10001);
https.createServer(options, app).listen(10002);

async function login() {
  console.log("Logging in...");
  ig.state.generateDevice(credentials.instagram.username);
  await ig.qe.syncLoginExperiments();
  Bluebird.try(async () => {
    const auth = await ig.account.login(credentials.instagram.username, credentials.instagram.password).then(() => {
      console.log('Logged in!');
      loggedIn = true;
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
}



async function uploadPost() {
  if (!loggedIn) return;
  console.log('Uploading new post...');
  let newMeme = await meme.getMemeJSON();
  downloadImageFromUrl(newMeme.url, async (success) => {
    if (!success) {
      uploadPost();
      return;
    };
    const publishResult = await ig.publish.photo({
      file: await readFileAsync(`${appRoot}/memes/meme.jpg`),
      caption: await caption.getCaption(),
    });
    console.log(`Upload status: ${publishResult.status}`);
  });
};

async function downloadImageFromUrl(url, callback) {
  let extension = url.endsWith("png") ? "png" : "jpg";
  request(url).pipe(fs.createWriteStream(`${appRoot}/memes/meme.${extension}`)).on('close', () => {
    if (extension === "png") convertMeme();
    resizeImage();
    return callback(true);
  })
}

async function convertMeme() {
  Jimp.read(`${appRoot}/memes/meme.png`, function (err, image) {
    image.scaleToFit(512, 512).write(`${appRoot}/memes/meme.jpg`);
  });
}

function resizeImage() {
  return new Promise(
    resolve => {
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      loadImage(`${appRoot}/memes/meme.jpg`).then((image) => {
        drawImageScaled(image, ctx);
        let jpegStream = canvas.createJPEGStream();

        let fileStream = fs.createWriteStream(`${appRoot}/memes/meme.jpg`);

        jpegStream.on('data', function (chunk) {
          fileStream.write(chunk);
        });

        jpegStream.on('end', function (chunk) {
          resolve(true);
        });
      });
    }
  )
}

function drawImageScaled(img, ctx) {
  var canvas = ctx.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.drawImage(img, 0, 0, img.width, img.height,
    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

schedule.scheduleJob('*/30 * * * *', () => {
  let delay = (random.int(0, 2) * 1000);
  setTimeout(uploadPost, delay);
});

