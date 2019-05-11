import { Router } from 'express'

import test from './test'
import user from './user'
import event from './event'
import folders from './folders'
import scan from './scan'
import application from './application'
import applicant from './applicant'
// import event from './event'
import { currentEvent } from './event/middleware'

const router = new Router()
router.use('/test', test)
router.use('/events', event)
router.use('/applicant', currentEvent, applicant)
router.use('/folder', currentEvent, folders)
router.use('/scan', currentEvent, scan)
router.use('/application', currentEvent, application)
router.use('/users', currentEvent, user)

export default router
