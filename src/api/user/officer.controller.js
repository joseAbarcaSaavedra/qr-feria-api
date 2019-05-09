import { success, fail } from '../../services/response/'
import User from './model'
import { signJWT, checkPassword } from '../../services/auth/index'

export const authOfficer = async (req, res) => {
  try {
    const { email, role } = req.body
    const officer = await User.findOne(
      {
        email,
        role
      },
      { email: 1, name: 1, role: 1, password: 1 }
    )

    if (officer && checkPassword(officer, req.body.password)) {
      const data = {
        user: {
          id: officer._id,
          name: officer.name,
          role: officer.role,
          email: officer.email
        },
        event: req.event
      }

      const token = await signJWT(data)

      success(res)({
        jwt: token,
        user: {
          name: officer.name,
          role: officer.role,
          email: officer.email
        },
        event: {
          name: req.event.name
        }
      })
    } else {
      fail(res)({
        message: 'Datos de usuario incorrectos, intente nuevamente.'
      })
    }
  } catch (error) {
    console.log('error', error)
    fail(res)({
      message: 'Ocurrio un problema, intenta nuevamente.'
    })
  }
}
