const reLoginJob =require('./module')
require('dotenv').config()

console.log(process.env.URL, process.env.LOGIN, process.env.PASSWORD)
// Trigger once
reLoginJob()
