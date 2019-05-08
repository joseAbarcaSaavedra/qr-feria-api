import { Router } from 'express'
import { list } from './controller'
// import { middleware as body } from 'bodymen'
import { checkRole } from '../../services/auth/middleware'

const router = new Router()

router.get('/list', checkRole(['company']), list)

export default router
