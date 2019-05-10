import { success, fail } from '../../services/response/'
import Folder from './model'
const base64 = require('base-64')

export const create = async (folderName, company, event) => {
  try {
    const name = folderName.toLowerCase()
    const key = `${event}_${company}_${base64.encode(name)}`
    const result = await Folder.findOneAndUpdate(
      { key },
      {
        name,
        event,
        company,
        key
      },
      { upsert: true, new: true }
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
        company: req.session.user.id
      },
      { name: 1, _id: 0 }
    )

    success(res)({ folders })
  } catch (error) {
    fail(res)({ message: 'ocurrio un problema al obtener las carpetas' })
  }
}
