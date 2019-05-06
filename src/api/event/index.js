import { Router } from 'express'
// import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create } from './controller'

import { schema } from './model'

const router = new Router()
const {
  name,
  dateFrom,
  dateTo,
  offerId,
  domainId,
  domain,
  active
} = schema.tree

router.post(
  '/',
  body({ name, dateFrom, dateTo, offerId, domainId, domain, active }),
  create
)

export default router
