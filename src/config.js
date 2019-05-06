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
          url: process.env.URL_SOA_CL || 'http://wsbcknd.trabajando.com',
          path: '/v1.3.5-CL/rest/Applicants/json/authenticate',
          params: {
            country: 'cl',
            client: 'portalmobile',
            token: 'b3b6b7e1c8bdb60a7e924c62d3cb4b3b'
          }
        },
        cv: {
          url: process.env.URL_SOA_CL || 'http://wsbcknd.trabajando.com',
          path: '/v1.3.5-CL/rest/Applicants/json/',
          params: {
            country: 'cl',
            client: 'portalmobile',
            token: 'b3b6b7e1c8bdb60a7e924c62d3cb4b3b'
          }
        },
        nppToken: {
          url: process.env.URL_SOA_CL || 'https://www.trabajando.cl',
          path: '/rest/token/get/',
          params: {
            domain: 857,
            country: 'cl',
            client: 'PortalPersonas',
            token: 'PortalPersonas'
          }
        }
      }
    },
    // http://travistidwell.com/jsencrypt/demo/
    authKey: {
      private: 'rsa_private.pem',
      public: 'rsa_public.pem',
      expirationTime: '12h'
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
      uri: 'mongodb://api:api123@ds163254.mlab.com:63254/heroku_8866j0tc',
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
        `mongodb://${process.env.DB_MONGO_USER}:${
          process.env.DB_MONGO_PASSWORD
        }@${process.env.DB_MONGO_HOST_PRIMARY}:${process.env.DB_MONGO_PORT}/${
          process.env.DB_MONGO_DATABASE
        }?authMechanism=MONGODB-CR`,
      useNewUrlParser: true
    }
  }
}

const _config = merge(config.all, config[config.all.env])
console.log('CONFIG!', _config)
module.exports = _config
export default module.exports
