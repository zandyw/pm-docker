const diskusage = require("diskusage");
const sendMessage = require('./wx');
const { totalmem, freemem } = require('os');
const { cpuUsage } = require('os-utils');
let {cpuLimit,memoryLimit,diskLimit} = process.env;

cpuLimit = cpuLimit || 90;
memoryLimit = memoryLimit || 95;
diskLimit = diskLimit || 500000000;

function format(num){
  const uni = ['','K','M','G','T'];
  let step = 0;
  while(num>1024){
    num/=1024;
    step++;
  }
  if(num%1!=0){
    num = num.toFixed(1)
  }
  return `${num}${uni[step]}B`;
}


const getCpuInfo = () =>new Promise((resolve)=>{
  cpuUsage((val)=>{
    resolve(Math.round(val*100))
  })
})  


const getMemoryInfo = () =>{
    const total = totalmem();
    const free = freemem();
    const percent = Math.round((total-free)*100/total);
    return {
      total:format(total),
      free:format(free),
      percent
    }    
}

async function checkStatus(){
    const [cpu,memory,disk] = await Promise.all([getCpuInfo(),getMemoryInfo(),diskusage.check('/')]);
    if(cpu>cpuLimit){
      sendMessage(`cpu预警 使用率 ${cpu}%`)
    }
    if(memory.percent>memoryLimit){
      sendMessage(`内存预警 memory total:${memory.total}, free:${memory.free}, 使用率:${memory.percent}%`)
    }
    if(disk.available<diskLimit){
       sendMessage(`磁盘空间预警  total:${format(disk.total)}, available:${format(disk.available)}`)
    }
}

setInterval(()=>{
  checkStatus()
},1000*60);





