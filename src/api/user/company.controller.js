import { success, fail } from '../../services/response/'
import User from './model'
import { create as saveSession } from './../session/controller'
import { domain, ws } from '../../config'
import { cryptGps, signJWT } from '../../services/auth/index'
import _compact from 'lodash/compact'

const fetch = require('node-fetch')

export const authCompany = async (req, res) => {
  try {
    // Prepare data
    const authParams = {
      email: req.body.email,
      password: await cryptGps(req.body.password)
    }

    if (req.body.company) authParams.company = { id: req.body.company }
    console.log('authParams', authParams)
    try {
      // Auth
      const request = await fetch(
        `${ws.service.gpsAuth.url}${ws.service.gpsAuth.path}`,
        {
          method: 'POST',
          body: JSON.stringify(authParams),
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const gpsResponse = await request.json()
      console.log('gpsResponse', gpsResponse)
      const {
        data: { user, companies }
      } = gpsResponse

      // Check auth response
      // If user have multiple company access
      // console.log('user', user)
      let arrCompanies = companies && companies.length > 1 ? companies : []

      arrCompanies = _compact(
        companies.map(company => {
          return company && company.id
            ? { id: company.id, name: company.name }
            : null
        })
      )

      const userData = {
        user: {
          gpsId:
            !req.body.company && arrCompanies.length > 1
              ? arrCompanies[0].id
              : req.body.company
              ? req.body.company
              : user.company.id,
          name: user.name,
          lastName: user.lastname,
          email: user.email,
          role: 'company',
          companies:
            req.body.company || (companies && companies.length <= 1)
              ? []
              : companies,
          gpsToken: user.token
        }
      }
      // Fake login
      /* const userData = {
        user: {
          gpsId: 366,
          name: 'tro',
          lastName: 'lazo',
          email: 'tro@lazo.com',
          role: 'company',
          companies: [],
          gpsToken:
            'XStoAQqEIfwc+GVn7hXVuN31BxJpgCK5lOoAaWMDGhkdj04BkK30hRSyMXTaXq1ORWC2MtQ1A9Ida9F8rVEFx/5YlFB690dF6/Q/RGnevI0='
        }
      } */

      userData.event = req.event

      const userDB = await updateUser(userData.user)
      if (userDB && userDB._id) {
        // New Session
        userData.user.id = userDB._id
        const sessionData = {
          user: userData.user,
          event: userData.event
        }

        // Create JWT
        const token = await signJWT(sessionData)

        // Save session backup on DB
        await saveSession({
          user: userDB._id,
          event: userData.event._id,
          jwt: token
        })

        // Remove data to the frontend response
        delete sessionData.user.id
        delete sessionData.user.gpsId
        delete sessionData.user.gpsToken

        /*  if (!req.body.company && arrCompanies && arrCompanies.length > 1) {
          sessionData.user.companies = arrCompanies
        } */

        success(res)({
          jwt: token,
          user: sessionData.user,
          event: {
            name: sessionData.event.name
          }
        })
      } else {
        // Problems on save user data
        fail(res)({
          message: 'Ocurrio un problema, intenta nuevamente. (-2)'
        })
      }
    } catch (error) {
      console.log('error', error)
      fail(res)({
        message: 'Los datos ingresados son incorrectos.'
      })
    }
  } catch (error) {
    console.log('error', error)
    fail(res)({
      message: 'Ocurrio un problema, intenta nuevamente.'
    })
  }
}

const updateUser = async data => {
  try {
    // console.log('data', data)
    const result = await User.findOneAndUpdate(
      { gpsId: data.gpsId, role: 'company' },
      {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        role: 'company',
        gpsToken: data.gpsToken
      },
      {
        upsert: true,
        new: true
      }
    )
    return result
  } catch (error) {
    console.log('error [updateUser]!', error)
    return null
  }
}
