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
      const timeStamp = new Date().getTime()
      
      return {
        accessToken: res.data.access_token,
        expires: timeStamp + res.data.expires_in * 1000
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

async function getTemplateList(access_token) {
  try {
    const res = await axios.request({
      baseURL: wechatBaseUrl,
      url: '/wxaapi/newtmpl/gettemplate',
      method: 'GET',
      params: {
        access_token,
      }
    });
    if(res && res.data && !res.data.errcode) {
      return res.data.data
    }
  } catch (error) {
    throw new Error('getTemplateList fail!')
  }
}

async function sendMessage({
  accessToken,
  openId,
  templateId,
  page,
  data,
  miniprogramState,
}) {
  try {
    const res = await axios.request({
      baseURL: wechatBaseUrl,
      url: `/cgi-bin/message/subscribe/send?access_token=${accessToken}`,
      method: 'POST',
      data: {
        touser: openId,
        template_id: templateId,
        page,
        data,
        miniprogram_state: miniprogramState
      }
    });
    if(res && res.data && !res.data.errcode) {
      return true
    } else {
      console.log('---message send errcode---', res.data.errcode)
    }
  } catch (error) {
    throw new Error('getTemplateList fail!')
  }
}

module.exports = {
  getAccessToken,
  login,
  getTemplateList,
  sendMessage,
}