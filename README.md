轻量级的非侵入式的node服务监控和预警程序,包含可选的企业微信消息推送功能。

### 安装
```
npm  install -g pm-docker
```

### 使用
```
pmd run [script]
```
script值为想要运行的node项目package.json中配置的scripts命令，默认值start

### 配置
如果需要启用企业微信消息推送功能,在你的项目目录创建pm-docker.env文件
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

