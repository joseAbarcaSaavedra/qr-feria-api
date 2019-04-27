/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    masterKey: requireProcessEnv('MASTER_KEY'),
    domain: 857,
    ws: {
      service: {
        auth: {
          url: 'http://wsbcknd.trabajando.com',
          path: '/v1.3.5-CL/rest/Applicants/json/authenticate',
          params: {
            country: 'cl',
            client: 'portalmobile',
            token: 'b3b6b7e1c8bdb60a7e924c62d3cb4b3b'
          }
        }
      }
    },
    // http://travistidwell.com/jsencrypt/demo/
    authKey: {
      private: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOAIBAAJAYPbWoCgBt+Y/KlMEIXLiuWmAkylqwKkrkTM5Oy2fg2CltsABX1Iv
      1QDyKOfSFBnar48x2tpqycKm2EpMPzqunwIDAQABAkBPcAoXfY8i1SvshcR9jrx2
      QBvI9IZzvmRl+Xwqok7rdvCkGnt3Un1kORqOFsfNjSIBmCi+TF5IXhhlVzkD8Igp
      AiEAqPECP8UnPww+ECc+4OkaZOkboZzZ9es7JusgK78ErvsCIQCS7n4yHnYoUtOa
      +LapAdEX13aDY+NSNPxvx6Hqx1odrQIgESMhj0Z4jLS5NvpELpx2yPW8j9BRa9jI
      z1HamZVu7DECID0MdsagPXvXnjA/srVaGeSME6PX9vWLKm/PRIlmNx0pAiB6yly6
      R6jbgmInBIo8qvAZkew2sx5uX18cN3IyuxR0pw==
      -----END RSA PRIVATE KEY-----`,
      public: `-----BEGIN PUBLIC KEY-----
      MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAYPbWoCgBt+Y/KlMEIXLiuWmAkylqwKkr
      kTM5Oy2fg2CltsABX1Iv1QDyKOfSFBnar48x2tpqycKm2EpMPzqunwIDAQAB
      -----END PUBLIC KEY-----`
    },
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {},
  development: {
    mongo: {
      uri: 'mongodb://api%3Aapi.%2C123@ds163254.mlab.com:63254/heroku_8866j0tc',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri:
        process.env.MONGODB_URI ||
        'mongodb://api%3Aapi.%2C123@ds163254.mlab.com:63254/heroku_8866j0tc'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
