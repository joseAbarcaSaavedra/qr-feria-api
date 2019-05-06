import { success, notFound, fail } from '../../services/response/'
import { User } from './model'

import { authOfficer } from './officer.controller'
import { authApplicant } from './applicant.controller'

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then(user => user)
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then(count =>
      User.find(query, select, cursor).then(users => ({
        count,
        rows: users.map(user => user.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? Object.assign(user, body).save() : null))
    .then(user => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then(user => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next)

// Auth Applicant User

const authCompany = async (req, res) => {
  try {
    success(res)({
      jwt: 'el-token-challa',
      user: { name: 'Empresa X' }
    })
  } catch (error) {
    console.log('error', error)
    fail(res)({
      message: 'Ocurrio un problema, intenta nuevamente.'
    })
  }
}

export const auth = async (req, res) => {
  switch (req.body.role) {
    case 'applicant':
      await authApplicant(req, res)
      break
    case 'company':
      await authCompany(req, res)
      break
    case 'officer':
    case 'backoffice':
      await authOfficer(req, res)
      break
    default:
      res.json({ message: 'Rol es requerido' })
      break
  }
}

/* exports.auth = function(req, res) {
	 try {
	 	var authParams = {
            userName: req.body.username,
            password: new Buffer(req.body.password).toString('base64'),
            domainId: req.configuration.portal.domainId,
            typeCheck: typeCheck(req.configuration, req.body.username)
        };

        model.people.auth(req.configuration, authParams).then(function(result){
        	if (result.status == 'OK' && result.data) {
	            var sessionParams = {
	                data: {
	                    applicantId: result.data.applicantId,
	                    client: req.query.client,
	                    domainId: req.configuration.portal.domainId
	                }
	            };

	            model.people.createToken(req.configuration, sessionParams).then(function(token){
	            	//Independiente del last login update se responde de forma positiva
	            	responseWithResult(res, {
	                    status: 'OK',
	                    message: 'generic',
	                    data: {
	                        token: token
	                    }
	                });

	            	//actualizar ultimo login
	            	model.people.updateLastLogin(req.configuration, result.data.applicantId).then(function(updated){
	            		console.log('updated lastLogin', updated);
	            	}, function(err){
	            		handleError(res, 'Problemas para actualizar lastLogin!', err)
	            	});

	            }, function(err){
	            	handleError(res, 'Problemas para generar la session!', err)
	            });
        	} else {
        		handleError(res, 'datos incorrectos!')
        	}
        }, function(err){
        	handleError(res, 'Problemas al iniciar sesion!', err)
        });
    } catch (err) {
    	handleError(res, 'problems in people auth method', err);
    }
};
 */
