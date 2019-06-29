require('dotenv').config()
const { hexMD5 } = require('./md5')
const fetch = require('node-fetch')
var schedule = require('node-schedule')

// Schedule
console.log(process.env.LOGIN, process.env.PASSWORD)
let reloginSchedule = schedule.scheduleJob('0 0,12 * * *', reLoginJob)
reLoginJob()
async function reLoginJob () {
  console.log(`[${new Date().toLocaleString()}] Re-login.....`)
  try {
    await logout()
    await login(process.env.LOGIN, process.env.PASSWORD)
    console.log(`[${new Date().toLocaleString()}] DONE.....`)
  }
  catch(e) {
    console.log(`[${new Date().toLocaleString()}] Error: ${e.message}`)
  }
}

async function encryptPassword(password) {
  let html = await fetch('http://logout.wifi/login').then(res => res.text())
  let pattern = html.match(/hexMD5\((.*)\)/)
  if(pattern === null) return null
  pattern = pattern[1].replace("document.login.password.value",password)
  pattern = eval(pattern)
  let encryptedPass = eval('hexMD5(pattern)')
  return encryptedPass
}

async function login(username,password) {
  password = await encryptPassword(password);

  var data = {
    "username": username,
    "password": password,
    "dst": "",
    "popup": "true"
  };

  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  await fetch('http://logout.wifi/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Upgrade-Insecure-Requests': 1
    },
    body: formBody
  })
  .then(res => res.text())
  .then(body => {
    // console.log(body)
    if(body.indexOf('You are logged in')<0)
      throw new Error('Not logged in :(')
  })
}

async function logout() {
  await fetch('http://logout.wifi/logout')
  .then(res => res.text())
  // .then(body => console.log(body))
}

// Server
// http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World');
// }).listen(8081, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:8081/');