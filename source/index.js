const { IgApiClient } = require('instagram-private-api');
const { readFile } = require('fs'); 
const { promisify } = require('util');
const { sample } = require('lodash');
const schedule = require('node-schedule');
const readFileAsync = promisify(readFile);

const credentials = require('./credentials.json')

async function uploadPost() {
  console.log("Uploading new post...");
  const ig = new IgApiClient();
  ig.state.generateDevice(credentials.instagram.username);
  await ig.qe.syncLoginExperiments();
  const loggedInUser = await ig.account.login(credentials.instagram.username, credentials.instagram.password);
  const path = './assets/smiley.jpg';
  const publishResult = await ig.publish.photo({
    file: await readFileAsync(path),
    caption: '<3',
  });
};

uploadPost();
