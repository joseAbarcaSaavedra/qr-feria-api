import { success, fail } from '../../services/response/'
import { tbjDecrypt } from '../../services/auth/index'
import { getCv } from '../user/applicant.controller'
import CheckIn from './model'
import _get from 'lodash/get'
export const create = async (req, res, next) => {
  try {
    const {
      body: { nppToken }
    } = req
    const applicantId = await tbjDecrypt(nppToken)
    const cvResponse = await getCv(applicantId)

    // Applicant Data
    const applicant = {
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
      )
    }

    const checkIn = {
      applicant: {
        comunityId: applicantId,
        nppToken: nppToken,
        email: applicant.email
      },
      event: req.session.event._id,
      officer: req.session.user.id
    }
    const result = await CheckIn.create(checkIn)

    // Show miniCv response
    success(res)({ success: result && result._id !== undefined, applicant })
  } catch (error) {
    fail(res, 500)({
      message: 'Problemas al hacer CheckIn',
      error: JSON.stringify(error)
    })
  }
}

export const count = async (req, res) => {
  try {
    const count = await CheckIn.count({ event: req.session.event._id })
    success(res)({ count })
  } catch (error) {
    success(res)({ count: -1 })
  }
}
