var schedule = require('node-schedule')
import reLoginJob from './module'
require('dotenv').config()
 
// Schedule
console.log(process.env.LOGIN, process.env.PASSWORD)
let reloginSchedule = schedule.scheduleJob('0 0,12 * * *', reLoginJob)
reLoginJob()

// Server
// http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World');
// }).listen(8081, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:8081/');