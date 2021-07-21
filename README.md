Lightweight non-invasive node service monitoring and early warning program, including optional enterprise wechat message push function.

Start with fork mode, single process, suitable for running in docker environment.

### Install
```
npm  install -g pm-docker
```

### USE
```
pmd run [script]
```
The script value is the scripts command configured in the node project package.json that you want to run.

### CONFIG
Create the pm-docker.env file in your project directory and fill in the complete configuration information
```
#log save path
logPath=

#upper limit of cpu useage percent
cpuLimit=90

#upper limit of memory useage percent
memoryLimit=95

#available disk
diskLimit=500000000

#企业id
corpid=

#自建应用secret
corpsecret=

#自建应用agentid
agentid=

#消息推送给谁
touser=
```

