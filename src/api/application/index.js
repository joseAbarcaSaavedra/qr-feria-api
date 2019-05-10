import { Router } from 'express'
import { create, count } from './controller'
import { middleware as body } from 'bodymen'
import { checkRole } from '../../services/auth/middleware'
const router = new Router()

router.post(
  '/',
  checkRole(['company']),
  body({
    position: {
      type: String,
      required: true
    },
    scan: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    evaluation: {
      type: Number,
      required: true
    }
  }),
  create
)

router.get('/count', checkRole(['company']), count)

export default router
