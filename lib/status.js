const diskusage             = require("diskusage");
const sendMessage           = require('./wx');
const { totalmem, freemem } = require('os');
const { cpuUsage }          = require('os-utils');
let {cpuLimit,memoryLimit,diskLimit} = process.env;

cpuLimit = cpuLimit || 90;
memoryLimit = memoryLimit || 200_000_000;
diskLimit = diskLimit || 1000_000_000;

function format(num){
  const uni = ['','K','M','G','T'];
  let step = 0;
  while(num > 1024){
    num /= 1024;
    step++;
  }
  if(num % 1 != 0){
    num = num.toFixed(1)
  }
  return `${num}${uni[step]}B`;
}

const getCpuInfo = () =>new Promise((resolve)=>{
  cpuUsage((val)=>{
    resolve(Math.round(val*100))
  })
})  


function once(type,time=1000*60*60){
  const t = +new Date();
  if((t - type.lastTime) > time){
    return t;
  }
  return false;
}

async function checkCpu(){
  const usage = await getCpuInfo();
  if(usage > cpuLimit){
      sendMessage(`Warning! cpu usage ${usage}%`)
  }
}


function checkMemory(){
  const total = totalmem();
  const free = freemem();
  if(free < memoryLimit){
    const t = once(checkMemory,1000*60*60);
    if(t){
      sendMessage(`Warning! memory free:${format(free)}, total:${format(total)}`)
      checkMemory.lastTime = t;
    }
  }
}
checkMemory.lastTime = 0;


async function checkDisk(){
  const {total,available} = await diskusage.check('/');
  if(available < diskLimit){
    const t = once(checkDisk,1000*60*60*24);
    if(t){
      sendMessage(`Warning! disk available:${format(available)}, total:${format(total)}`)
      checkDisk.lastTime = t;
    }
  }
}
checkDisk.lastTime = 0;


setInterval(()=>{
  checkMemory();
  checkCpu();
  checkDisk();
},1000*60*2);





