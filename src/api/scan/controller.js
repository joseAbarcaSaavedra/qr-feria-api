import { success, fail } from '../../services/response/'
import { tbjDecrypt } from '../../services/auth/index'
import {
  getCv,
  parseApplicantData,
  updateUser
} from '../user/applicant.controller'
import Scan from './model'

export const create = async (req, res, next) => {
  try {
    const {
      body: { nppToken, type }
    } = req

    const applicantId = await tbjDecrypt(nppToken)
    const cvResponse = await getCv(applicantId)
    cvResponse.applicantCrypt = nppToken
    cvResponse.applicantId = applicantId
    // Applicant Data
    const applicantData = parseApplicantData(cvResponse)
    // Update User Data
    const applicant = await updateUser(applicantData)

    if (applicant && applicant._id) {
      const scan = {
        applicant: applicant._id,
        type: type,
        event: req.session.event._id,
        officer: req.session.user.id
      }
      const result = await Scan.create(scan)

      // Show miniCv response
      success(res)({ id: result && result._id ? result._id : null })
    } else {
      fail(res, 500)({
        message: 'Problemas al almacenar datos del usuario'
      })
    }
  } catch (error) {
    fail(res, 500)({
      message: 'Problemas al hacer Scan',
      error: JSON.stringify(error)
    })
  }
}

export const index = async (req, res) => {
  try {
    const result = await Scan.findOne(
      {
        _id: req.query.id,
        officer: req.session.user.id
      },
      { applicant: 1 }
    ).populate([
      {
        path: 'applicant',
        select: [
          'name',
          'lastName',
          'maidenName',
          'picture',
          'phone',
          'email',
          'nppToken'
        ]
      }
    ])
    success(res)(result)
  } catch (error) {
    console.log('Error', error)
    success(res)({ success: false })
  }
}

export const count = async (req, res) => {
  try {
    const qry = {
      event: req.session.event._id,
      type: req.query.type
    }

    if (req.query.type === 'application') qry.officer = req.session.user.id

    const count = await Scan.count(qry)
    success(res)({ count })
  } catch (error) {
    success(res)({ count: -1 })
  }
}
