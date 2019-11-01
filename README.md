### 环境

* dependencies: `@types/express` `@types/node` `express`

* devDependencies: `ts-node`(直接运行ts,不用编译) `ts-node-dev`(监听文件变化自动重启服务,可代替nodemon [short alias] tsnd) `typescript` `nodemon`

* `ts-node-dev --no-notify`取消mac terminal-notifier自动提示


### 小程序服务端

* `/sns/jscode2session` get sessionKey

* redis save sessionKey

### VS Code调试nodejs

#### launch.json配置 `launch`直接启动node服务 `attach`关联一个node服务（在npm script里面设置inspect`--inspect=0.0.0.0:3001`）

```json
{
  "name": "启动程序",
  "type": "node",
  "request": "launch",
  "program": "${workspaceRoot}/bin/www"
},
{
  "name": "Attach to Node",
  "type": "node",
  "request": "attach",
  "address": "localhost",
  "port": 3000,
  "restart": true
}
```
### Linux 

`lsof -i tcp:[port]` 查看某个端口进程

`kill -9 [pid]` 杀掉某个进程

### Nginx

`nginx -t` 检查配置是否正确

`nginx -s reload` 重启nginx

反向代理 `proxy_pass` 路径问题

#### nginx 代理 websocket

