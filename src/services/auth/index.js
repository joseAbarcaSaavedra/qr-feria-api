import { authKey } from '../../config'
const { validate } = require('rut.js')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const fs = require('fs')
const Rijndael = require('rijndael-js')
const MCrypt = require('mcrypt').MCrypt
const base64 = require('base-64')

export const typeCheck = username => {
  var typeCheck = '4'
  var mailPattern = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  if (username.match(mailPattern)) {
    // email
    typeCheck = '2'
  } else if (validate(username)) {
    // rut
    typeCheck = '1'
  }
  return typeCheck
}

export const signJWT = async data => {
  const privateKey = fs.readFileSync(authKey.private)
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      privateKey,
      {
        expiresIn: authKey.expirationTime,
        algorithm: 'RS256'
      },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  })
}

export const verifyJWT = async token => {
  const publicKey = fs.readFileSync(authKey.public)
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithm: 'HS256' }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  })
}

export const tbjCrypt = str => {
  try {
    const key = '3NKr1p74m_3pLs'
    const md5Key = md5(key)
    let cipher = new Rijndael(md5Key, 'cbc')
    let ciphertext = cipher.encrypt(str, 256, md5(md5Key))
    ciphertext = ciphertext.toString('base64')
    /* var rijnCbc = new MCrypt('rijndael-256', 'cbc')
    rijnCbc.open(md5Key, md5(md5Key)) */
    //var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    //let ciphertext = Buffer.from(rijnCbc.encrypt(str)).toString('base64')
    console.log('after replace:', ciphertext)
    ciphertext = ciphertext.replace(/\+\//g, '-_')
    console.log('before replace:', ciphertext)
    ciphertext = ciphertext.replace(/=/g, '')
    return ciphertext
  } catch (error) {
    console.log('ERROR CRYPT', error)
    return ''
  }
}

export const tbjDecrypt = str => {
  try {
    let pad = 4 - (str.length % 4)
    if (pad > 3) pad = 0
    for (let x = 0; x < pad; x++) str = str.concat('=')
    str = str.replace(/-_/g, '+/')
    const key = '3NKr1p74m_3pLs'
    const md5Key = md5(key)
    var rijnCbc = new MCrypt('rijndael-256', 'cbc')
    rijnCbc.open(md5Key, md5(md5Key))
    console.log('str', str)
    let decrypted = rijnCbc.decrypt(Buffer.from(str, 'base64')).toString()
    decrypted = decrypted.replace(/\u0000/g, '')
    return decrypted
  } catch (error) {
    console.log('ERROR DECRYPT', error)
    return ''
  }
}

export const checkPassword = (user, password) => {
  try {
    console.log('user.password', user.password)
    console.log('password', password)
    return base64.encode(user.password) === base64.encode(password)
  } catch (error) {
    return false
  }
}
