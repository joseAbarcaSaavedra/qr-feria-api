import { Router } from 'express'
// import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create } from './controller'

import { schema } from './model'

const router = new Router()
const { name, address, dateFrom, dateTo, active } = schema.tree

router.post('/', body({ name, address, dateFrom, dateTo, active }), create)

export default router
