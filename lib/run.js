const path = require('path');
const cwd = process.cwd();
const fs = require("fs-extra");
const cwdPkgPath = path.resolve(process.cwd(),'package.json');
if(!fs.existsSync(cwdPkgPath)){
   console.log('Warn: Cannot found package.json in dir')
   process.exit();;
}
let {scripts} = require(cwdPkgPath);
require('dotenv').config({ path:path.resolve(cwd,'pm-docker.env')});
const spawn = require('child_process').spawn;
const sendMessage = require('./wx');
const {info, error, fatal} = require('./logger');
require('./status');

 
function run(script){

  if(!scripts || !(script in scripts)){
    console.log('Warn: scripts name is not found in package.json');
    process.exit();
  }

  //运行命令行  生成进程
  const cspr = spawn('npm', ['run', script], {cwd})


  //启动后显示进程状态
  cspr.on('spawn', function (e) { 
    const {pid,channel,spawnfile,spawnargs,connected,signalCode} = cspr;
    info(`启动进程 pid:${pid} | spawnfile:${spawnfile} | spawnargs:${spawnargs} | signalCode:${signalCode} | channel:${channel}  | connected:${connected} `);  
  })

  //显示标准输出
  cspr.stdout.on('data', function (data) {  
    info(data);
    process.stdout.write(data);
  })
  
  //监听进程错误
  cspr.stderr.on('data', async function (data) {
    var data = data.toString();

    //存储错误日志
    error(data);

    //调用企业微信api
    sendMessage(data);
  })
  
  
  cspr.on('exit', (code) => {

    //退出进程时重点通知  
    sendMessage(`服务进程退出,code: ${code}`);
    fatal(`服务进程退出,code: ${code}`);

    if(code!==0){
      console.log(`info: server restarting`);
      run(script)
    } 
  });

}


module.exports = run

