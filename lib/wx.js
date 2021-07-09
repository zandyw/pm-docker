const {get,post} = require('./request')
const {fatal} = require('./loger');
const path = require('path');
const {name} = require(path.resolve(process.cwd(),'package.json'))


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
    content = name+'服务监控: '+content;
    
    const access_token = await getToken(corpid,corpsecret);//应用权限token
    const res = await post('https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+access_token,{
      touser,
      msgtype: "text",
      agentid,
      text: {
          content
      },
    })
    console.log('发送消息完成',res) 
  } catch(e){
    fatal(e);
  }
}

module.exports = {
  sendMessage
}