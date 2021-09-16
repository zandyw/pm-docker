const path                = require('path');
const fs                  = require("fs-extra");
const cwd                 = process.cwd();

const cwdPkgPath = path.resolve(process.cwd(),'package.json');
if(!fs.existsSync(cwdPkgPath)){
  console.log('Warn: Cannot found package.json in dir')
  process.exit();
}

require('dotenv').config({ path:path.resolve(cwd,'pm-docker.env')});
let {scripts}              = require(cwdPkgPath);
const spawn                = require('child_process').spawn;
const sendMessage          = require('./wx');
const {info, error, fatal} = require('./logger');
require('./status');

const pm = {
  restart_time: 0,
  restart_delay: 0,
  restart_task: null
}

 
function run(script,env){

  if(!scripts || !(script in scripts)){
    console.log('Warn: scripts name is not found in package.json');
    process.exit();
  }

  
  const cspr = spawn('npm', ['run', script], {cwd,env})

  const {pid,channel,spawnfile,spawnargs,connected,signalCode} = cspr;
  const cspr_msg = `service started \r
restart times ${pm.restart_time} \r
pid:${pid} \r
spawnfile:${spawnfile} \r
spawnargs:${spawnargs} \r
signalCode:${signalCode} \r
channel:${channel} \r
connected:${connected}`

  info(cspr_msg);
  sendMessage(cspr_msg);

  
  cspr.stdout.on('data', function (data) {  
    info(data);
    process.stdout.write(data);
  })
  
  
  cspr.stderr.on('data', async function (data) {
    var data = data.toString();
    error(data);
    sendMessage(data);
    process.stderr.write(data);
  })
  
  
  cspr.once('exit', (code,signal) => {

    const msg = `service has exited with code [${code}] via signal [${signal || 'SIGINT'}]`

    sendMessage(msg);
    fatal(msg);

    clearTimeout(pm.restart_task);
    pm.restart_task = setTimeout(() => {
      pm.restart_time++;
      run(script,env)  
    }, pm.restart_delay);

  }); 
}


module.exports = run

