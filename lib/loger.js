const log4js = require("log4js");
const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");

const todayLogPath = path.resolve(process.cwd(),'logs/today.log');

log4js.configure({
  appenders: { todayLog: { type: "file", filename:todayLogPath} },
  categories: { default: { appenders: ["todayLog"], level: "info" } }
});  

const logger = log4js.getLogger("todayLog");

function split(){
  const stat = fs.statSync(todayLogPath);
  const fmstr = 'YY-MM-DD';
  const logDate = moment(stat.mtime).format(fmstr);
  const today = moment().format(fmstr);
    
  if(today>logDate){
    //每日备份
    fs.copySync(todayLogPath,path.resolve(process.cwd(),`logs/${logDate}.log`))
    //清空today日志
    fs.writeFileSync(todayLogPath,'');//默认flag为w 
  }
}

module.exports = ['trace','debug','info','warn','error','fatal'].reduce((pre,key)=>{
  pre[key] = (data)=>{split();logger[key](data.toString())}
  return pre;
},{})
