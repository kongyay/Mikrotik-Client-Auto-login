var _module = _interopRequireDefault(require("./module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

console.log(process.env.URL, process.env.LOGIN, process.env.PASSWORD); // Trigger once

(0, _module.default)();