const log4js       = require("log4js");
const path         = require("path");
const moment       = require("moment");
const fs           = require("fs-extra");
const glob         = require("glob");
const sendMessage  = require('./wx');

let logger         = null;
let { logPath }    = process.env;
logPath = logPath || 'logs';
const todayLogPath = path.resolve(process.cwd(),logPath,'today.log');


function init(){
  log4js.configure({
    appenders: { todayLog: { type: "file", filename:todayLogPath} },
    categories: { default: { appenders: ["todayLog"], level: "info" } }
  });  
  logger = log4js.getLogger("todayLog");
}

function clear(){
  glob(path.resolve(process.cwd(),logPath,'*.log'), function (er, files) {
    if(er){
      sendMessage('Failed to clean logs:'+er.message);
      return;
    }
    files.filter((pstr)=>{
      const {name} = path.parse(pstr);
      if(name=='today')return false;
      if(moment(name).isBefore(moment().subtract(30, 'days')))return true;
    }).forEach((pstr)=>{
      fs.remove(pstr)
    })    
  })
}


function split(){
  const stat = fs.statSync(todayLogPath);
  const fmstr = 'Y-MM-DD';//'Y-MM-DD HH:mm:ss'
  const logDate = moment(stat.mtime).format(fmstr);
  const today = moment().format(fmstr);
    
  if(today > logDate){
    fs.copySync(todayLogPath,path.resolve(process.cwd(),logPath,`${logDate}.log`))
    //clean today log
    fs.writeFileSync(todayLogPath,'');//default flag is w 

    clear();
  }
}

module.exports = ['trace','debug','info','warn','error','fatal'].reduce((pre,key)=>{
  pre[key] = (data)=>{
    if(!logger){
      init();
    }
    split();
    logger[key](data.toString());
  }
  return pre;
},{})
