const path                = require('path');
const fs                  = require("fs-extra");
const cwd                 = process.cwd();

const cwdPkgPath = path.resolve(process.cwd(),'package.json');
if(!fs.existsSync(cwdPkgPath)){
  console.log('Warn: Cannot found package.json in dir')
  process.exit();;
}

require('dotenv').config({ path:path.resolve(cwd,'pm-docker.env')});
let {scripts}              = require(cwdPkgPath);
const spawn                = require('child_process').spawn;
const sendMessage          = require('./wx');
const {info, error, fatal} = require('./logger');
require('./status');

 
function run(script,isRestart){

  if(!scripts || !(script in scripts)){
    console.log('Warn: scripts name is not found in package.json');
    process.exit();
  }

  
  const cspr = spawn('npm', ['run', script], {cwd})

  
  cspr.on('spawn', function (e) { 
    const {pid,channel,spawnfile,spawnargs,connected,signalCode} = cspr;
    const msg = `pid:${pid} | spawnfile:${spawnfile} | spawnargs:${spawnargs} | signalCode:${signalCode} | channel:${channel}  | connected:${connected} `
  
    if(isRestart){
      info('service restart '+msg);
      sendMessage('service restart');
    }else{
      info('service start '+msg);
    }
  })


  cspr.stdout.on('data', function (data) {  
    info(data);
    process.stdout.write(data);
  })
  
  
  cspr.stderr.on('data', async function (data) {
    var data = data.toString();
    error(data);
    sendMessage(data);
  })
  
  
  cspr.on('exit', (code) => {

    const msg = `service has exited with code: ${code}`

    sendMessage(msg);
    fatal(msg);

    if(code!==0){
      console.log(`info: server restarting`);
      run(script,true)
    } 
  });
}

module.exports = run

