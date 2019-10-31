const axios = require('axios');
const { appInfo } = require('../util/config')

const wechatBaseUrl = 'https://api.weixin.qq.com';

async function getAccessToken () {
  const { appid, secret } = appInfo;
  try {
    const res = await axios.request({
      baseURL: wechatBaseUrl,
      url: '/cgi-bin/token',
      method: 'GET',
      params: {
        grant_type: 'client_credential',
        appid,
        secret,
      }
    });
    if(res && res.data && !res.data.errcode) {
      return {
        accessToken: res.data.access_token,
        expires: res.data.expires_in
      }
    }
  } catch (error) {
    throw new Error('no accessToken!')
  }
}

async function login(code) {
  const { appid, secret } = appInfo;
  try {
    const res = await axios.request({
      baseURL: wechatBaseUrl,
      url: '/sns/jscode2session',
      method: 'GET',
      params: {
        grant_type: 'authorization_code',
        appid,
        secret,
        js_code: code,
      }
    });
    if(res && res.data && !res.data.errcode) {
      return {
        openId: res.data.openid,
        sessionKey: res.data.session_key
      }
    }
  } catch (error) {
    throw new Error('login fail!')
  }
}

module.exports = {
  getAccessToken,
  login
}