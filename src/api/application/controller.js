import { success, notFound, fail } from '../../services/response/'
import Application from './model'
import { domain, ws } from '../../config'
import { create as createFolder } from './../folders/controller'
import { byId as scanById } from './../scan/controller'
const fetch = require('node-fetch')

export const create = async (req, res) => {
  try {
    // create company folder
    const folder = await createFolder(
      req.body.position,
      req.session.user.id,
      req.session.event._id
    )

    if (folder && folder._id) {
      // Get scan data
      const scan = await scanById(req.body.scan)

      if (scan && scan._id) {
        // Save application
        const application = {
          directory: {
            parentKey: req.event.folder,
            title: folder.name
          },
          applicants: [
            {
              externalId: scan.applicant.communityId,
              comment: req.body.comment || '',
              recommendations: [
                {
                  value: req.body.evaluation || 0
                }
              ]
            }
          ]
        }

        const gpsResult = await saveInGps(
          application,
          req.session.user.gpsToken
        )

        if (gpsResult.success) {
          // Save in Mongo
          const result = await Application.create({
            scan: scan._id,
            event: req.session.event._id,
            company: req.session.user.id,
            position: folder._id,
            comment: req.body.comment || '',
            evaluation: req.body.evaluation || 0
          })
          success(res)({ success: result && result._id !== undefined })
        } else {
          // TODO: check logout exception!
          fail(res)({
            message: gpsResult.message
          })
        }
      } else {
        fail(res)({
          message: 'Problemas al obtener lectura de QR'
        })
      }
    } else {
      fail(res)({
        message: 'Problemas al guardar cargo'
      })
    }
  } catch (error) {
    fail(res)({
      message: 'Ups, ocurrio un problema al enviar postulación',
      error: JSON.stringify(error)
    })
  }
}

// Call to wsgps service
const saveInGps = async (application, gpstoken) => {
  try {
    const request = await fetch(
      `${ws.service.gpsStorage.url}${ws.service.gpsStorage.path}`,
      {
        method: 'POST',
        body: JSON.stringify(application),
        headers: { 'Content-Type': 'application/json', gpstoken }
      }
    )
    const result = await request.json()
    return { success: true, error: false, data: result, message: '' }
  } catch (error) {
    console.log('error!', error)
    return {
      success: false,
      error: error,
      message:
        'Problemas al guardar el candidato en Bodega, revise si su cuenta tiene permisos para acceder a la Bodega'
    }
  }
}

export const count = async (req, res) => {
  try {
    const count = await Application.count({
      event: req.session.event._id,
      company: req.session.user.id
    })
    success(res)({ count })
  } catch (error) {
    fail(res)({ message: 'Problemas al obtener los datos' })
  }
}
