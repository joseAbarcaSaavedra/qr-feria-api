import { Router } from 'express'
import { create, check, edit } from './controller'
import { middleware as body } from 'bodymen'
import { checkRole } from '../../services/auth/middleware'

const router = new Router()

router.post(
  '/check',
  checkRole(['backoffice']),
  body({
    identification: {
      required: true,
      type: String
    }
  }),
  check
)
router.post(
  '/',
  checkRole(['backoffice']),
  body({
    firstName: {
      required: true,
      type: String
    },
    lastName: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String
    },
    phone: {
      required: true,
      type: String
    },
    identification: {
      required: true,
      type: String
    },
    identificationType: {
      required: true,
      type: Number
    },
    password: {
      type: String
    }
  }),
  create
)
router.put('/:nppToken', checkRole(['backoffice']), edit)

export default router
