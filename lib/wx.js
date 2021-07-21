const {get,post} = require('./request')
const {fatal}    = require('./logger');
const path       = require('path');
let {name}       = require(path.resolve(process.cwd(),'package.json'))

name = name || '';

async function getToken(corpid,corpsecret){ 
    const data = await get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
    return data.access_token;
}

async function sendMessage(content){
  const {corpid,corpsecret,touser,agentid} = process.env;

  if(!corpid || 
     !corpsecret ||
     !touser ||
     !agentid ||
     !content    
    )return;

  try{
    content = `[${name} service monitoring]\n ${content}`;
    
    const access_token = await getToken(corpid,corpsecret);//应用权限token
    const res = await post('https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+access_token,{
      touser,
      msgtype: "text",
      agentid,
      text: {
          content
      },
    })
  } catch(e){
    fatal(e);
  }
}

module.exports = sendMessage