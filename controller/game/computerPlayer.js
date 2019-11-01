const EventEmitter = require('events');
const Player = require('./player');

let nextComputerId = 0;

class ComputerPlayer extends Player {
  constructor() {
    const computerId = `robot-${++nextComputerId}`;
    super({
      uid: computerId,
      uname: computerId,
      uavatar: 'https://oss-public.fangdd.com/prod/static/FoAafuu8Gm4vCJ4SV9EuOUMLYd5A.jpg'
    });
    this.emitter = new EventEmitter();
  }

  /**
   * 模拟玩家行为
   */
  simulate() {
    this.receive('start', () => this.play());
    this.receive('result', () => this.stop());
    this.send('join');
  }

  /**
   * 游戏开始后，随机时间后随机选择
   */
  play() {
    this.playing = true;
    const randomTime = () => Math.floor(100 + Math.random() * 2000);
    const randomChoice = () => {
      if (!this.playing) return;
      this.send("choice", {
        choice: Math.floor(Math.random() * 10000) % 3 + 1
      });
      setTimeout(randomChoice, randomTime());
    }
    setTimeout(randomChoice, 10);
  }

  /**
   * 游戏结束后，标记起来，阻止继续随机选择
   */
  stop() {
    this.playing = false;
  }

  /**
   * 发送消息给当前玩家，直接转发到 emitter
   */
  send(message, data) {
    this.emitter.emit(message, data);
  }

  /**
   * 从当前的 emitter 处理消息
   */
  receive(message, handle) {
    this.emitter.on(message, handle);
  }
}

module.exports = ComputerPlayer;
