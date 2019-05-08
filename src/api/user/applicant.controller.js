import { success, fail } from '../../services/response/'
import User from './model'
import { create as saveSession } from './../session/controller'
import { signJWT, typeCheck, tbjCrypt } from '../../services/auth/index'
import { domain, ws } from '../../config'
import _merge from 'lodash/merge'
import _get from 'lodash/get'

const base64 = require('base-64')
const fetch = require('node-fetch')
const queryString = require('query-string')

export const authApplicant = async (req, res) => {
  try {
    const authParams = {
      userName: req.body.email,
      password: base64.encode(req.body.password),
      domainId: domain,
      typeCheck: typeCheck(req.body.email)
    }

    // Auth
    const request = await fetch(
      `${ws.service.auth.url}${ws.service.auth.path}?${queryString.stringify(
        ws.service.auth.params
      )}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(authParams, ws.service.auth.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()

    if (response.status === 'OK') {
      const { data } = response
      const applicantId = base64.decode(data.applicantId)
      const applicantCrypt = await tbjCrypt(applicantId)
      const cvResponse = await getCv(applicantId)
      // Get CV
      try {
        data.user = {
          id: applicantId,
          firstName: _get(cvResponse, 'data.personalInfo.firstName', ''),
          middleName: _get(cvResponse, 'data.personalInfo.middleName', ''),
          lastName: _get(cvResponse, 'data.personalInfo.lastName', ''),
          maidenName: _get(cvResponse, 'data.personalInfo.maidenName', ''),
          email: _get(cvResponse, 'data.personalInfo.emails.primaryEmail', ''),
          picture: _get(cvResponse, 'data.personalInfo.picture', ''),
          phone: _get(
            _get(cvResponse, 'data.personalInfo.phoneNumbers', []).filter(
              phone => phone.place === 'mobile'
            ),
            '[0].number',
            ''
          ),
          role: 'applicant',
          cvUrl: `https://www.trabajando.cl/cvcandidato/${applicantCrypt}`
        }

        data.event = req.event

        // Update User Data
        const user = await updateUser(data)

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
          message: 'Ocurrio un problema, intenta nuevamente. (-1)'
        })
      }
    } else {
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

export const getCv = async applicantId => {
  try {
    const cvRequest = await fetch(
      `${ws.service.cv.url}${
        ws.service.cv.path
      }${applicantId}?${queryString.stringify(ws.service.cv.params)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const cvResponse = await cvRequest.json()
    return cvResponse
  } catch (error) {
    return null
  }
}

const updateUser = async data => {
  try {
    // console.log('data', data)
    const result = await User.findOneAndUpdate(
      { communityId: data.user.id, role: 'applicant' },
      {
        name: `${data.user.firstName} ${data.user.middleName}`,
        lastName: data.user.lastName,
        maidenName: data.user.maidenName,
        email: data.user.email,
        picture: data.user.picture,
        role: 'applicant',
        communityId: data.user.id
      },
      {
        upsert: true
      }
    )
    return result
  } catch (error) {
    console.log('error [updateUser]!', error)
    return null
  }
}
