#!/usr/bin/env node
const { program } = require('commander');
const {version} = require('../package.json');

program
  .version(version)
  .option('-v --version', 'print pm-docker version');

program  
  .command('run <script> [env]')
  .description('run your program in fork mode by the scripts name in package.json')
  .action((script,env)=>{
    if(typeof env === 'string'){
      const envArr = env.split('=');
      if(envArr.length !== 2){
         console.log('the env arg should be a string like this: "key=value"')
         return;
      }
      process.env[envArr[0]]=envArr[1];
    }
   
    require('../lib/run')(script,process.env);
  })

program.parse(process.argv);


 
  