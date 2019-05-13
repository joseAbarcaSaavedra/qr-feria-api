import { fail } from '../../services/response/'
import { tbjDecrypt } from '../../services/auth/'
export const parseNppToken = async (req, res, next) => {
  try {
    req.applicantId = await tbjDecrypt(req.params.nppToken)
    next()
  } catch (error) {
    fail(res)({
      message: 'Problemas al validar el token de Npp'
    })
  }
}
