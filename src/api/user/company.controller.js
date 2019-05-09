import { success, fail } from '../../services/response/'
import User from './model'
import { create as saveSession } from './../session/controller'
import { domain, ws } from '../../config'
import { cryptGps, signJWT } from '../../services/auth/index'

const fetch = require('node-fetch')

export const authCompany = async (req, res) => {
  try {
    // Prepare data
    /* const authParams = {
      email: req.body.email,
      password: await cryptGps(req.body.password)
    } */

    // Auth
    /* const request = await fetch(
      `${ws.service.authGps.url}${ws.service.authGps.path}`,
      {
        method: 'POST',
        body: JSON.stringify(authParams),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json() */

    // TODO: Check auth response!

    const data = {
      user: {
        id: '5cd3927b20c57a6addf607da',
        gpsId: 131313,
        name: 'el-name',
        email: 'el-email@trabajando.com',
        role: 'company',
        domain: []
      }
    }

    data.event = req.event

    const user = await updateUser(data.user)
    if (user && user._id) {
      // New Session
      const sessionData = {
        user: data.user,
        event: data.event
      }

      // Create JWT
      const token = await signJWT(sessionData)

      // Save session backup on DB
      await saveSession({
        user: user._id,
        event: data.event._id,
        jwt: token
      })

      // Remove data to the frontend response
      delete sessionData.user.id

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
        email: data.email,
        role: 'company'
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
