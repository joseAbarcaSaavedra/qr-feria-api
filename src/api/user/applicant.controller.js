import { success, fail } from '../../services/response/'
import User from './model'
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
      // Get CV
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
        data.user = {
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
        // New Session
        const token = await signJWT(data)
        success(res)({
          jwt: token,
          user: data.user,
          event: {
            name: req.event.name
          }
        })
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
