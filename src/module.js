require('dotenv').config()
const { hexMD5 } = require('./md5')
const fetch = require('node-fetch')

module.exports = async function reLoginJob () {
  const isConnected = await checkInternet();
  if(isConnected) {
    console.log(`[${new Date().toLocaleString()}] Skip: Already connected`)
    return;
  }
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
  let html = await fetch(process.env.URL+'/login').then(res => res.text())
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

  await fetch(process.env.URL+'/login', {
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
  await fetch(process.env.URL+'/logout')
  .then(res => res.text())
  // .then(body => console.log(body))
}


function checkInternet() {
  return new Promise((resolve,reject) => {
    fetch('https://www.google.com/')
    .then(res => resolve(true))
    .catch(err => resolve(false))
  })  
}