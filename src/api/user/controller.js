import { success, notFound, fail } from '../../services/response/'
import User from './model'

import { authOfficer } from './officer.controller'
import { authCompany } from './company.controller'
import { authApplicant } from './applicant.controller'

export const create = async ({ bodymen: { body } }, res, next) => {
  try {
    const result = await User.create(body)
    success(res, 201)(result)
  } catch (error) {
    console.log('Error', error)
    fail(res)({ error: JSON.stringify(error) })
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then(count =>
      User.find(query, select, cursor).then(users => ({
        count,
        rows: users.map(user => user.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? Object.assign(user, body).save() : null))
    .then(user => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next)

// Auth
export const auth = async (req, res) => {
  switch (req.body.role) {
    case 'applicant':
      await authApplicant(req, res)
      break
    case 'company':
      await authCompany(req, res)
      break
    case 'officer':
    case 'backoffice':
      await authOfficer(req, res)
      break
    default:
      res.json({ message: 'Rol es requerido' })
      break
  }
}
