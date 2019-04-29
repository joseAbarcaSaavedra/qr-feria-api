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
        },
        cv: {
          url: 'http://wsbcknd.trabajando.com',
          path: '/v1.3.5-CL/rest/Applicants/json/',
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
      private: 'rsa_private.pem',
      privateVal: `-----BEGIN PRIVATE KEY-----
      MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHjncfqkoDuvRW
      Lui9694E9UoKKT414twe8nFP4De3JExqF3O9qpEL3kU/gH4X4PQHyqerNhyjw7zH
      KMTVatd9WuzVVO/rrW+yFLvCbXMFuafWrn3nzlnZuk0lUj6D0t4BMRoS3z0o3fl0
      852Mif5wDd4Fmi9ZvazG68YkYuFAYgyNXj/byEpcp5cYuiLOjHQlo4o0SwIGzMxj
      ucNTAT5vKWk7OieNfkTD0UdlQJKHjV+Cdj1/Ek/ptdbuthksVxyW4Hs3johf54L2
      RB2BBTxDv25zQtxuTAN6Sz0QrbQT9SdXHBl9OxYlKhguTOSuTLrNndmhRl2UDte4
      5asNA/iFAgMBAAECggEAQCj29fBbUa23R0pXvFBslq2Cu5edD9g7q5uJgQP3BeQe
      yXF23gFMF0PEgfE/GVBTRXoLxIlmVeTl+iaKeo+abwxf3wsrBFxD8D6oS4/DDpEt
      fGGny3LWAqHakehKfzm59SojVvP9hvkvbkGxYvEvJDnhK23yUWkhdudxUluUTo1m
      A0tuuYkMsuXjH84LUSIS+daratOdwdATVHxm+T7X/FIVgpr2r8fDxw0HiCOxH629
      i6GHjnviCTfbtzkRcMQbIt2qrYOQEfJs3bu3GZTd6kvVhwH0s3V/qRdewbhdoIYx
      79404Fkl64WMVKScuHci1HIea0fEMRUS88gkrmPs4QKBgQDyxwGvBTwp0BRHXd6l
      lFiMNguQQWRDyF9AjqlsX5s2Gkk4as+AE2GGMJ0GgGPknwoZeXF6i7AyjGm83aFN
      Vy0r7ClJDUhLLO7De6EEksACghrjHYfFvkk8YTrj9DEYne0l/1Amp0IC2LEHlyD2
      CY3zslmHHT+pSjqnXRTtO7ZFmQKBgQDSbNbivNFTyKWoIfegLdR1gHSLrMMv2QG7
      D/SJRyJrF46PmGoOKrXhfqAYvPkLg87dSm4YM/CYt1A+3cPJwdPWp8QE5O9Qrjin
      9LULSIp1gVOuFYcLTGt3t/1ifVDjtwIn4U1FF7mm+os3wgLWqOC1Gy61ztPp/ZaR
      FO9EbSxFzQKBgAM+vbsFKuS0L1E05AD6lqRpJIZtGVX+m6dVQNZ+AKkceNYUN2nS
      2H7er3qixLMNnSjyAp5Mt7I1RkSMAdfyzlvD8FlVoB3BH//k6yYQgBiIfKuEfYgb
      Hwd7lTnuzakykzTq0LtziOJY2yTq1Dn1rrwPKjswHOW6ZEZQbDMvlSQhAoGBAJG7
      JydotWBdOb0zqReaJeYqzIxfXd6pX/V5m1XnmgKpEeaJHAorskM1OxNm7OP4qS/A
      +HZyolJhwoWHeK0mO9wR3EO3ebZasoo/g5MI7jtrEdUiu6ArkNIc7rNjLr5GZIvS
      EX2kbMMkCX7YMrcPxnAnHzZyw3juU3SvFvZA1cSRAoGBAMtHyVdHcImJA447L++z
      geDwOTT1Gl44uKb78NlMZsLr0Z3cCM0mT9q51xekyWlkkLErKXd1dhI4A+u6qPWF
      n33QXEzU/poJBmnzJis0eeByYDE0eKWaX1mbJAbwsp1BMrpxKw8rNS1Oo05b/763
      x/p+n1CI0/NRgaFHTsNuvhk4
      -----END PRIVATE KEY-----
      `,
      public: 'rsa_public.pem',
      publicVal: `-----BEGIN PUBLIC KEY-----
      MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx453H6pKA7r0Vi7oveve
      BPVKCik+NeLcHvJxT+A3tyRMahdzvaqRC95FP4B+F+D0B8qnqzYco8O8xyjE1WrX
      fVrs1VTv661vshS7wm1zBbmn1q59585Z2bpNJVI+g9LeATEaEt89KN35dPOdjIn+
      cA3eBZovWb2sxuvGJGLhQGIMjV4/28hKXKeXGLoizox0JaOKNEsCBszMY7nDUwE+
      bylpOzonjX5Ew9FHZUCSh41fgnY9fxJP6bXW7rYZLFccluB7N46IX+eC9kQdgQU8
      Q79uc0LcbkwDeks9EK20E/UnVxwZfTsWJSoYLkzkrky6zZ3ZoUZdlA7XuOWrDQP4
      hQIDAQAB
      -----END PUBLIC KEY-----
      `,
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
