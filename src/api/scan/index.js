import { Router } from 'express'
import { create, count, index } from './controller'
import { middleware as body } from 'bodymen'
import { middleware as query } from 'querymen'
import { checkRole } from '../../services/auth/middleware'

const router = new Router()

router.post(
  '/',
  checkRole(['officer', 'company']),
  body({
    nppToken: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    }
  }),
  create
)

router.get(
  '/count',
  checkRole(['officer', 'company']),
  query({
    type: {
      type: String,
      required: true
    }
  }),
  count
)

router.get(
  '/',
  checkRole(['officer', 'company']),
  query({
    id: {
      type: String,
      required: true
    }
  }),
  index
)

export default router
