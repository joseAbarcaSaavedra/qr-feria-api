import { success, fail } from '../../services/response/'
import Folder from './models'
const base64 = require('base-64')
export const create = async (folderName, companyId, event) => {
  try {
    const name = folderName.toLowerCase()
    const key = `${event}-${companyId}-${base64.encode(folderName)}`
    const result = await Folder.findOneAndUpdate(
      { key },
      {
        name,
        event,
        companyId,
        key
      },
      { upsert: true }
    )
    return result
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export const list = async (req, res) => {
  try {
    const folders = await Folder.find(
      {
        event: req.session.event._id,
        companyId: req.session.user.id
      },
      { name: 1, _id: 1 }
    )
    success(res)({ folders })
  } catch (error) {
    fail(res)({ message: 'ocurrio un problema al obtener las carpetas' })
  }
}
