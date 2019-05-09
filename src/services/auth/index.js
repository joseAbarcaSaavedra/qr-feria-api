import { authKey, ws } from '../../config'

const { validate } = require('rut.js')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const queryString = require('query-string')

// const md5 = require('md5')
const fs = require('fs')
/* const Rijndael = require('rijndael-js') */
// const MCrypt = require('mcrypt').MCrypt
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

export const tbjCrypt = async str => {
  try {
    const request = await fetch(
      `${ws.service.nppToken.url}${
        ws.service.nppToken.path
      }${queryString.stringify({
        ...ws.service.nppToken.params,
        id: str,
        action: 'en'
      })}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const {
      data: { token }
    } = await request.json()

    return token
  } catch (error) {
    console.log('ERROR CRYPT', error)
    return ''
  }
}

export const tbjDecrypt = async str => {
  try {
    const request = await fetch(
      `${ws.service.nppToken.url}${
        ws.service.nppToken.path
      }${queryString.stringify({
        ...ws.service.nppToken.params,
        id: str,
        action: 'de'
      })}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const {
      data: { id }
    } = await request.json()

    return id
  } catch (error) {
    console.log('ERROR DECRYPT', error)
    return ''
  }
}

export const cryptGps = async str => {
  return 'ola-ke-ase'
}

export const checkPassword = (user, password) => {
  try {
    return base64.encode(user.password) === base64.encode(password)
  } catch (error) {
    return false
  }
}
