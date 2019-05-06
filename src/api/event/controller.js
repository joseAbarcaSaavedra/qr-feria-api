import Event from './model'
import { success } from '../../services/response/'

export const create = async ({ bodymen: { body } }, res, next) => {
  const data = body
  data.dateFrom = new Date(body.dateFrom)
  data.dateTo = new Date(body.dateTo)
  Event.create(data)
    .then(event => event)
    .then(success(res, 201))
    .catch(next)
}

export const current = async () => {
  try {
    // To-do: Agregar filtro por fecha a esta consulta
    const event = await Event.findOne({ active: true })
    return event
  } catch (error) {
    return null
  }
}
