import { Router } from 'express'

import api from './api'
import views from './views'

const router = new Router()
router.use('/api', api)
router.use('/', views)

export default router
