const log4js       = require("log4js");
const path         = require("path");

let { logPath,logPattern}    = process.env;
logPath = logPath || 'logs/day.log';
logPattern = logPattern || '.yyyy-MM-dd';
const dayLogPath = path.resolve(process.cwd(),logPath);


log4js.configure({
  appenders: { dayLog: { 
    type: 'dateFile', 
    filename:dayLogPath,
    keepFileExt:true,
    pattern: logPattern,//'.yyyy-MM-dd-hh-mm-ss',
    daysToKeep:30,
    alwaysIncludePattern:false
  } },
  categories: { default: { appenders: ["dayLog"], level: "info" } }
});  
let logger = log4js.getLogger("dayLog");

module.exports = ['trace','debug','info','warn','error','fatal'].reduce((pre,key)=>{
  pre[key] = (data)=>{
    logger[key](data.toString());
  }
  return pre;
},{})
