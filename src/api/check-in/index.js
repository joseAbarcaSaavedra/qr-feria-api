import { Router } from 'express'
import { create, count } from './controller'
import { middleware as body } from 'bodymen'
import { checkRole } from '../../services/auth/middleware'

const router = new Router()

router.post(
  '/',
  checkRole(['officer']),
  body({
    nppToken: {
      required: true,
      type: String
    }
  }),
  create
)

router.get('/count', checkRole(['officer']), count)

export default router
