import Event from './model'
import { success, notFound, fail } from '../../services/response/'

export const create = async ({ bodymen: { body } }, res, next) => {
  const data = body
  data.dateFrom = new Date(body.dateFrom)
  data.dateTo = new Date(body.dateTo)
  Event.create(data)
    .then(event => event)
    .then(success(res, 201))
    .catch(error => {
      console.log('ERROR!', error)
      fail(res)({ error: JSON.stringify(error) })
    })
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Event.count(query)
    .then(count =>
      Event.find(query, select, cursor).then(users => ({
        count,
        rows: users.map(user => user.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? Object.assign(user, body).save() : null))
    .then(user => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next)

export const current = async () => {
  try {
    // To-do: Agregar filtro por fecha a esta consulta
    const event = await Event.findOne({ active: true })
    return event
  } catch (error) {
    return null
  }
}
