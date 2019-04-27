const { validate } = require('rut.js')

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
