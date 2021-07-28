const {get,post} = require('./request')
const {fatal}    = require('./logger');
const path       = require('path');
const moment     = require('moment');
let {name}       = require(path.resolve(process.cwd(),'package.json'))

name = name || '';

const tokenCache = {
  access_token: '',
  expires: 0
}

async function getToken(corpid,corpsecret){ 
  try{
    const now = +new Date();
    if(now<tokenCache.expires && tokenCache.access_token!==''){
        return tokenCache.access_token;
    }

    const data = await get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
    if(data.errcode==0){
      tokenCache.access_token = data.access_token;
      tokenCache.expires = now + (data.expires_in*1000);
      return data.access_token;
    }else{
      fatal('[获取企业微信应用权限token失败]'+JSON.stringify(data));
    }
  }catch(e){
    fatal(e);
  }
}

async function sendMessage(content){
  const {corpid,corpsecret,touser,agentid} = process.env;
  const msgTime = moment().format('YYYY-MM-DD hh:mm:ss:SSS');

  if(!corpid || 
     !corpsecret ||
     !touser ||
     !agentid ||
     !content    
    )return;

  try{
    content = `[${name} service monitoring] \r
[${msgTime}] \r
${content}`;
    
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