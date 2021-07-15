#!/usr/bin/env node
const { program } = require('commander');
const {version} = require('../package.json');

program
  .version(version)
  .option('-v --version', 'print pm11 version');

program  
  .command('run [script]')
  .description('run your program in fork mode by the scripts name in package.json')
  .action((script)=>{
    require('../lib/run')(script);
  })

program.parse(process.argv);


 
  