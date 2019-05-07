import { success } from '../../services/response/'

export const authCompany = async (req, res) => {
  try {
    success(res)({
      jwt: 'el-token-challa',
      user: { name: 'Empresa X', role: 'company', id: 'dasdad' },
      event: {
        name: req.event.name
      }
    })
  } catch (error) {
    console.log('error', error)
    fail(res)({
      message: 'Ocurrio un problema, intenta nuevamente.'
    })
  }
}
