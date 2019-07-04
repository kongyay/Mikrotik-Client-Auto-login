Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reLoginJob;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

const _require = require('./md5'),
      hexMD5 = _require.hexMD5;

const fetch = require('node-fetch');

function reLoginJob() {
  return _reLoginJob.apply(this, arguments);
}

function _reLoginJob() {
  _reLoginJob = _asyncToGenerator(function* () {
    console.log(`[${new Date().toLocaleString()}] Re-login.....`);

    try {
      yield logout();
      yield login(process.env.LOGIN, process.env.PASSWORD);
      console.log(`[${new Date().toLocaleString()}] DONE.....`);
    } catch (e) {
      console.log(`[${new Date().toLocaleString()}] Error: ${e.message}`);
    }
  });
  return _reLoginJob.apply(this, arguments);
}

function encryptPassword(_x) {
  return _encryptPassword.apply(this, arguments);
}

function _encryptPassword() {
  _encryptPassword = _asyncToGenerator(function* (password) {
    let html = yield fetch(process.env.URL + '/login').then(res => res.text());
    let pattern = html.match(/hexMD5\((.*)\)/);
    if (pattern === null) return null;
    pattern = pattern[1].replace("document.login.password.value", password);
    pattern = eval(pattern);
    let encryptedPass = eval('hexMD5(pattern)');
    return encryptedPass;
  });
  return _encryptPassword.apply(this, arguments);
}

function login(_x2, _x3) {
  return _login.apply(this, arguments);
}

function _login() {
  _login = _asyncToGenerator(function* (username, password) {
    password = yield encryptPassword(password);
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
    yield fetch(process.env.URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Upgrade-Insecure-Requests': 1
      },
      body: formBody
    }).then(res => res.text()).then(body => {
      // console.log(body)
      if (body.indexOf('You are logged in') < 0) throw new Error('Not logged in :(');
    });
  });
  return _login.apply(this, arguments);
}

function logout() {
  return _logout.apply(this, arguments);
}

function _logout() {
  _logout = _asyncToGenerator(function* () {
    yield fetch(process.env.URL + '/logout').then(res => res.text()); // .then(body => console.log(body))
  });
  return _logout.apply(this, arguments);
}