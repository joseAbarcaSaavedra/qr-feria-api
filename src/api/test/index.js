import { Router } from 'express'
const router = new Router()

router.get('/ping', (req, res, next) => {
  res.json({ success: true })
})

export default router
