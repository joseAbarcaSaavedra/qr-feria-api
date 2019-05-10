import { fail } from '../../services/response/'
import { current } from './controller'

export const currentEvent = async (req, res, next) => {
  try {
    // To-do: Agregar caché a esta consulta
    const event = await current()
    if (event) {
      req.event = event
      req.event.folder = req.event.name
        .split(' ')
        .join('_')
        .toUpperCase()
      console.log('req.event.folder', req.event.folder)
      next()
    } else {
      fail(res)({
        message: 'Problemas al obtener la información del evento.'
      })
    }
  } catch (error) {
    fail(res)({
      message: 'Problemas al obtener la información del evento. (-1)'
    })
  }
}
