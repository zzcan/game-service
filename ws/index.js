const WebSocket = require('ws');
const redisClient = require('../db/db')
const HumanPlayer = require('../controller/game/humanPlayer');
class MyWebSockt {
  constructor(server) {
    this.wss = this.init();
    this.auth(server, this.wss)
  }
  auth(server, wss) {
    server.on('upgrade', async (request, socket, head) => {
      console.log('auth token from request...');
      const token = request.headers.token;
      if(!token) {
        socket.destroy();
        return
      }
      const data = await redisClient.getAsync(token);
      if(!data) {
        socket.destroy();
        return
      }
    
      console.log('token is parsed!');
      const userInfo = JSON.parse(data);
      const user = {
        uid: token, 
        uname: userInfo.nickName, 
        uavatar: userInfo.avatarUrl
      };
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, user);
      });
    });
  }
  init() {
    const wss = new WebSocket.Server({ noServer: true });
    wss.on('connection', (ws, user) => {
      // 创建玩家 
      const player = new HumanPlayer(user, ws); 
      // 玩家上线
      player.online();
    })
    return wss;
  }
}

module.exports = MyWebSockt;