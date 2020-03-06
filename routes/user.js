const express = require('express');
const router = express.Router();
const { login, getAccessToken, sendMessage } = require('../service/index');
const { encryptBySha1 } = require('../util/util');
const redisClient = require('../db/db');
const debug = require('debug')('user-request:login')
const debugSub = require('debug')('user-request:sub')

const { subcribeTypes } = require('../util/config')

router.post('/login', async (req, res) => {
  try {
    const { code, rawUserInfo } = req.body;
    debug('login req body is %o', req.body)

    const session = await login(code);
    const encrypt = encryptBySha1(session.sessionKey);

    const info = { ...JSON.parse(rawUserInfo), openId: session.openId }
    debug('login new info is %o', info)

    await redisClient.setAsync(encrypt, JSON.stringify(info));

    res.json({
      code: 200,
      data: {
        sessionKey: encrypt,
        userInfo: info
      },
      msg: 'success'
    });
  } catch (error) {
    throw new Error(error.message)
  }
})

router.post('/requestSubcribe', async (req, res) => {

  try {
    const { token } = req.headers;
    debugSub('subcribe req token is %s', token)

    const { tempIds } = req.body
    debugSub('subcribe req body is %o', req.body)

    const info = await redisClient.getAsync(token);
    const newInfo = { ...JSON.parse(info), tempIds }

    debugSub('subcribe newInfo is %o', newInfo)

    await redisClient.setAsync(token, JSON.stringify(newInfo))

    res.json({
      code: 200,
      mgs: 'success'
    })
  } catch (error) {
    throw new Error(error.message)
  }
})

router.get('/subcribeMessage', async (req, res) => {
  try {
    const { token } = req.headers;

    const info = await redisClient.getAsync(token);

    debugSub('subcribe info is %s', info)

    const { openId, tempIds } = JSON.parse(info || {})

    const accessTokenStr = await redisClient.getAsync('accessToken')
    let accessToken = accessTokenStr ? JSON.parse(accessTokenStr) : null
    const timeStamp = new Date().getTime()

    if(!accessToken || accessToken.expires_in <= timeStamp) {
      const accessTokenInfo = await getAccessToken()

      accessToken = accessTokenInfo
  
      await redisClient.setAsync('accessToken', JSON.stringify(accessTokenInfo));
    }

    debugSub('accessToken is %o', accessToken)

    debugSub('tempIds is %o', tempIds)

    tempIds.forEach(async tmpKey => {
      const params = {
        accessToken: accessToken.accessToken,
        openId,
        templateId: tmpKey,
        page: 'pages/index/index',
        miniprogramState: "trial",
        data: subcribeTypes[tmpKey]
      }

      debugSub('send %s message params is %o', tmpKey, params)

      const isSend = await sendMessage(params)

      debugSub('send %s message is %s', tmpKey, isSend ? '成功！' : '失败！')
    })

    res.json({
      code: 200,
      mgs: 'success'
    })
  } catch (error) {
    throw new Error(error.message)
  }
})

module.exports = router;
