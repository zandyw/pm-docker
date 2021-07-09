const diskusage = require("diskusage");
const {sendMessage} = require('./wx');
const {totalmem,freemem} = require('os');
const {cpuUsage} = require('os-utils');

/*重点指标  
内存使用率
cpu使用率
硬盘使用率
*/

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

const getDiskInfo = (path)=>disk.check(path);


async function checkStatus(){
    const [cpu,memory,disk] = await Promise.all([getCpuInfo(),getMemoryInfo()]);
    if(cpu>80){
      sendMessage(`cpu预警 使用率 ${cpu}%`)
    }
    if(memory.percent>80){
      sendMessage(`内存预警 memory total:${memory.total}, free:${memory.free}, 使用率:${memory.percent}%`)
    }
}

setInterval(()=>{
  checkStatus()
},1000*60);





