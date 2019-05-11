import Applicant from './model'
import { domain, ws } from '../../config'
import { signJWT, typeCheck, tbjCrypt } from '../../services/auth/index'
import _merge from 'lodash/merge'
const fetch = require('node-fetch')
const { validate, clean, format } = require('rut.js')
export const create = async (req, res) => {
  try {
    const applicant = {
      firstName: req.body.firstName,
      middleName: '',
      lastName: req.body.lastName,
      maidenName: '',
      sex: 1,
      email: req.body.email,
      backupEmail: req.body.email,
      password: req.body.password || req.body.lastName,
      countryId: 3,
      regionId: 1,
      cityId: 50,
      communeId: 342,
      address: 'Padre Mariano 82',
      cellNumber: req.body.phone,
      question: '¿dónde se registro como candidato?',
      answer: 'feria',
      status: 0,
      joinDate: '20121203',
      domainId: domain,
      dateOfBirth: '19890726',
      rut: req.body.identification,
      civilStatus: 0,
      zipcode: 8885552,
      /* homePhone: '072-511346',
      officePhone: '+562-511346', */
      updateStatus: 1,
      showBirthDate: 0,
      showCivilStatus: 0,
      regionName: 'Metropolitana',
      cityName: 'Santiago',
      communeName: 'Santiago',
      nationality: 'CHILENO',
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
    // Save in mongo

    // TODO: add id and nppToken to mongodb data

    res.json({
      success: true,
      data: req.body,
      createResult
    })
  } catch (error) {
    console.log('error', error)
    res.json({
      success: false,
      message: 'Problemas al registrar al candidato',
      error: JSON.stringify(error)
    })
  }
}

export const edit = async (req, res) => {
  try {
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false })
  }
}

export const check = async (req, res) => {
  try {
    const identification = clean(req.body.identification)
    const checkResult = await checkSOA(identification)
    const {
      data: { personalInfo }
    } = checkResult

    const nppToken = await tbjCrypt(personalInfo.personId)

    res.json({
      exist: true,
      data: {
        identificationType: personalInfo.originCountryDoc.description,
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
    res.json({
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

const checkSOA = async (identification, type = '1') => {
  try {
    const checkParams = {
      id: identification,
      domainId: domain,
      typeCheck: type
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
    return null
  }
}

const createSOA = async data => {
  try {
    const request = await fetch(
      `${ws.service.addCv.url}${ws.service.addCv.path}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(data, ws.service.auth.params)),
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
      `${ws.service.addCv.url}${ws.service.addCv.path}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(data, ws.service.auth.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()
    return response
  } catch (error) {
    return null
  }
}
