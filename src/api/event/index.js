import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show } from './controller'

import { schema } from './model'

const router = new Router()
const { name, address, dateFrom, dateTo, active, domain } = schema.tree

router.post(
  '/',
  body({ name, address, dateFrom, dateTo, active, domain }),
  create
)
/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of users.
 * @apiSuccess {Object[]} rows List of users.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', query(), index)

/**
 * @api {get} /users/:id Retrieve user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 */
router.get('/:id', show)
export default router
