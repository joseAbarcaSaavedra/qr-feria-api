import { Router } from 'express'
const path = require('path')
const router = new Router()

router.get('/*', (req, res, next) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '../public/')
  })
})

export default router
