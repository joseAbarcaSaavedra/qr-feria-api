// import { success, notFound, fail } from '../../services/response/'
import Session from './model'

export const create = async data => {
  try {
    const result = await Session.create(data)
    return result
  } catch (error) {
    console.log('error', error)
    return null
  }
}
