import { Router } from 'express'

import test from './test'
import user from './user'
import event from './event'
import checkIn from './check-in'

// import event from './event'
import { currentEvent } from './event/middleware'

const router = new Router()
router.use('/test', test)
router.use('/events', event)
router.use('/check-in', checkIn)
router.use('/users', currentEvent, user)

export default router
