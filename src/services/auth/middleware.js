import { verifyJWT } from './index'

export const checkRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const bearer = req.headers['authorization'].replace('Bearer ', '')
      const jwt = await verifyJWT(bearer)
      const {
        user: { role }
      } = jwt

      if (roles.indexOf(role) !== -1) {
        req.session = jwt
        next()
      } else {
        res.status(401).json({ message: 'Unauthorized!' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Autorization token are required!' })
    }
  }
}
