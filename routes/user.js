const express = require('express');
const router = express.Router();
const { login } = require('../service/index');
const { encryptBySha1 } = require('../util/util');
const redisClient = require('../db/db');

router.post('/login', async (req, res) => {
  try {
    const { code, rawUserInfo } = req.body;
    const session = await login(code);
    const encrypt = encryptBySha1(session.sessionKey);
    await redisClient.set(encrypt, rawUserInfo);
    res.json({
      code: 200,
      data: {
        sessionKey: encrypt,
        userInfo: JSON.parse(rawUserInfo)
      },
      msg: 'success'
    });
  } catch (error) {
    throw new Error(error.message)
  }
})

router.post('/update', async (req, res) => {
  try {
    const { rawUserInfo } = req.body;
    const { token } = req.headers;
    await redisClient.set(token, rawUserInfo);
    res.json({
      code: 200,
      data: rawUserInfo,
      mgs: 'success'
    })
  } catch (error) {
    throw new Error(error.message)
  }
})

module.exports = router;
