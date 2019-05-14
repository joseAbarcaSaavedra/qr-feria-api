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
      required: false,
      maxlength: 20
    },
    scan: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: false,
      maxlength: 50
    },
    evaluation: {
      type: Number,
      required: false
    }
  }),
  create
)

router.get('/count', checkRole(['company']), count)

export default router
