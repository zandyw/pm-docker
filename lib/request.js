
const https = require('https');
function get(url){
  return new Promise((resolve,reject)=>{
    https.get(url, (res) => { 

      let body = [];

      res.on('data', function (chunk) {
        body.push(chunk)
      })

      res.on('end', function () {
        body = Buffer.concat(body)
        resolve(JSON.parse(body.toString()))
      })

    }).on('error', (e) => {
      reject(e);
    });
  })
}

function post(url,data){
  return new Promise((resolve,reject)=>{

    const postData = JSON.stringify(data);

    const options = {
      port: 443,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(url,options, (res) => {

      let body = [];
      
      res.on('data', function (chunk) {
        body.push(chunk)
      })

      res.on('end', function () {
        body = Buffer.concat(body)
        resolve(JSON.parse(body.toString()))
      })

    }).on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  })
}



module.exports = {
  get,
  post
}