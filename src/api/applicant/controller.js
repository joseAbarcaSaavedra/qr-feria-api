import Applicant from './model'
import { success, fail } from '../../services/response/'
import { domain, ws } from '../../config'
import { tbjCrypt } from '../../services/auth/index'
import _merge from 'lodash/merge'
import { getCv } from '../user/applicant.controller'
import { bodyParser } from 'body-parser'
const fetch = require('node-fetch')
const moment = require('moment')
const base64 = require('base-64')
const { clean } = require('rut.js')
export const create = async (req, res) => {
  try {
    const applicant = {
      firstName: req.body.firstName,
      middleName: '',
      lastName: req.body.lastName,
      maidenName: '',
      sex: 0,
      email: req.body.email,
      backupEmail: req.body.email,
      password: req.body.password || req.body.lastName,
      countryId: 3,
      regionId: 1,
      cityId: 50,
      communeId: 342,
      address: 'Por completar',
      cellNumber: req.body.phone,
      question: '¿dónde se registro como candidato?',
      answer: 'feria',
      status: 0,
      joinDate: moment().format('YYYYMMDD'),
      domainId: domain,
      dateOfBirth: '19000101',
      rut: req.body.identification,
      civilStatus: 0,
      zipcode: 0,
      /* homePhone: '072-511346',
      officePhone: '+562-511346', */
      updateStatus: 1,
      showBirthDate: 0,
      showCivilStatus: 0,
      regionName: 'Metropolitana',
      cityName: 'Santiago',
      communeName: 'Santiago',
      nationality: '-',
      originCountryDoc: req.body.identificationType,
      residenceCountryId: 1 // number
    }

    const createResult = await createSOA(applicant)
    const {
      data: { id }
    } = createResult

    req.body.nppToken = await tbjCrypt(id)
    req.body.cvUrl = `https://www.trabajando.cl/cvcandidato/${
      req.body.nppToken
    }`

    success(res)({
      success: true,
      data: req.body /* ,
      createResult */
    })

    // Async
    const aData = req.body
    aData.password = base64.encode(aData.password)
    await updateInMongo(
      {
        ...aData,
        event: req.session.event._id,
        createdBy: req.session.user.id
      },
      req.session.event
    )
  } catch (error) {
    console.log('error', error)
    fail(res)({
      success: false,
      message: 'Problemas al registrar al candidato',
      error: JSON.stringify(error)
    })
  }
}

export const edit = async (req, res) => {
  try {
    const _oldCv = await getCv(req.applicantId)
    const {
      data: { personalInfo }
    } = _oldCv

    try {
      const applicantData = {
        personId: req.applicantId,
        firstName: req.body.firstName,
        mddleName: personalInfo.mddleName,
        lastName: req.body.lastName,
        maidenName: personalInfo.maidenName,
        cellNumber: req.body.phone,
        sex: personalInfo.gender.id,
        civilStatus: personalInfo.maritalStatus.id,
        countryId: personalInfo.countryId,
        regionId: personalInfo.region.id,
        cityId: personalInfo.city.id,
        communeId: personalInfo.commune.id,
        rut: personalInfo.idNumber,
        zipcode: personalInfo.zipcode,
        updateStatus: 1,
        status: 1,
        nationality: personalInfo.nationality,
        email: req.body.email,
        residenceCountryId: personalInfo.residenceCountry.id
      }

      const soaResult = await updateSOA(applicantData)
      const { status, data } = soaResult

      let updatePassResult = true

      if (req.body.password && req.body.password.trim() !== '') {
        const {
          data: { success }
        } = await updatePassword(req.applicantId, req.body.password)
        updatePassResult = success
      }

      if (status === 'OK' && data && data.success && updatePassResult) {
        req.body.nppToken = await tbjCrypt(req.applicantId)
        req.body.cvUrl = `https://www.trabajando.cl/cvcandidato/${
          req.body.nppToken
        }`

        success(res)({
          success: true,
          data: req.body
        })
        // Async
        const aData = req.body
        aData.password = base64.encode(aData.password)
        await updateInMongo(
          {
            ...aData,
            event: req.session.event._id,
            updatedBy: req.session.user.id,
            updatedAt: new Date()
          },
          req.session.event
        )
      } else if (!updatePassResult) {
        fail(res)({
          success: false,
          message: 'Problema al actualizar la contraseña (-4)',
          error: JSON.stringify(soaResult)
        })
      } else {
        fail(res)({
          success: false,
          message: 'Problema al actualizar datos del usuario (-3)',
          error: JSON.stringify(soaResult)
        })
      }
    } catch (error) {
      console.log('error', error)
      fail(res)({
        success: false,
        message: 'Problema al actualizar datos del usuario (-2)',
        error: JSON.stringify(error)
      })
    }
  } catch (error) {
    console.log('error!', error)
    fail(res)({
      success: false,
      message: 'Problema al obtener datos del usuario (-1)',
      error: JSON.stringify(error)
    })
  }
}

export const check = async (req, res) => {
  try {
    const identification =
      req.body.originCountryDoc === 1
        ? clean(req.body.identification)
        : req.body.identification
    const checkResult = await checkSOA(
      identification,
      req.body.originCountryDoc
    )
    const {
      data: { personalInfo }
    } = checkResult

    const nppToken = await tbjCrypt(personalInfo.personId)

    success(res)({
      exist: true,
      personalInfo,
      data: {
        identificationType: personalInfo.originCountryDoc.id,
        identification: identification,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.emails ? personalInfo.emails.primaryEmail : '',
        phone: personalInfo.phoneNumbers
          ? personalInfo.phoneNumbers.find(phone => {
              return phone.place === 'mobile'
            }).number
          : '',
        nppToken: nppToken,
        cvUrl: `https://www.trabajando.cl/cvcandidato/${nppToken}`
      }
    })
  } catch (error) {
    console.log('error', error)
    success(res)({
      exist: false,
      data: {
        identificationType: 1,
        identification: req.body.identification,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nppToken: '',
        cvUrl: ''
      }
    })
  }
}

export const count = async (req, res) => {
  try {
    const qry = {
      event: req.session.event._id
    }

    const count = await Applicant.count(qry)
    success(res)({ count })
  } catch (error) {
    success(res)({ count: -1 })
  }
}

const checkSOA = async (identification, type = 1) => {
  try {
    const checkParams = {
      id: identification,
      domainId: domain,
      typeCheck: type === 1 ? type : 6 // Passport
    }
    const request = await fetch(
      `${ws.service.checkCv.url}${ws.service.checkCv.path}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(checkParams, ws.service.checkCv.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()

    return response
  } catch (error) {
    console.log('error', error)
    return null
  }
}

const createSOA = async data => {
  try {
    const request = await fetch(
      `${ws.service.addCv.url}${ws.service.addCv.path}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(data, ws.service.addCv.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()
    return response
  } catch (error) {
    return null
  }
}

const updateSOA = async data => {
  try {
    const request = await fetch(
      `${ws.service.editCv.url}${ws.service.editCv.path}`,
      {
        method: 'PUT',
        body: JSON.stringify(_merge(data, ws.service.editCv.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()
    return response
  } catch (error) {
    return null
  }
}

const updatePassword = async (applicantId, password) => {
  try {
    const data = _merge(
      {
        personId: parseInt(applicantId),
        password: base64.encode(password)
      },
      ws.service.updatePassword.params
    )
    const request = await fetch(
      `${ws.service.updatePassword.url}${ws.service.updatePassword.path}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()
    return response
  } catch (error) {
    return { data: { success: false } }
  }
}

const updateInMongo = async (data, event) => {
  try {
    const result = await Applicant.findOneAndUpdate(
      { identification: data.identification, event: event.id },
      data,
      {
        upsert: true,
        new: true
      }
    )
    console.log('RESULT CREATE IN MONGO', result)
    return result
  } catch (error) {
    return null
  }
}
