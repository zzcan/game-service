const crypto = require('crypto')

function encryptBySha1(data) {
  return crypto.createHash('sha1').update(data, 'utf8').digest('hex');
}

function decryptByAES(encrypted, key, iv) {
  const encryptedData = Buffer.from(encrypted, 'base64')
  const sessionKey = Buffer.from(key, 'base64')
  const newIv = Buffer.from(iv, 'base64')
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, newIv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    let decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    return decoded
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  encryptBySha1,
  decryptByAES
}