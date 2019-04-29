import { authKey } from '../../config'
const { validate } = require('rut.js')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

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
  const privateKey = process.env.KEYS
    ? process.env.KEYS.private
    : fs.readFileSync(authKey.private)
  console.log('process.env.KEYS', process.env.KEYS)
  console.log('privateKey', privateKey)
  /* console.log(
    'KEYS',
    JSON.stringify({
      private: authKey.privateVal,
      public: authKey.publicVal
    }).replace(/ /g, '')
  ) */
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
  const publicKey = process.env.KEYS
    ? process.env.KEYS.public
    : fs.readFileSync(authKey.public)
  console.log('publicKey', publicKey)
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithm: 'HS256' }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  })
}
