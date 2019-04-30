import { success, notFound, fail } from '../../services/response/'
import { User } from '.'
import {
  typeCheck,
  signJWT,
  checkPassword,
  tbjCrypt,
  tbjDecrypt
} from '../../services/auth/index'
import { domain, ws } from '../../config'
import _merge from 'lodash/merge'
import _get from 'lodash/get'
import _map from 'lodash/map'

const base64 = require('base-64')
const fetch = require('node-fetch')
const queryString = require('query-string')

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
const authApplicant = async (req, res) => {
  try {
    const authParams = {
      userName: req.body.email,
      password: base64.encode(req.body.password),
      domainId: domain,
      typeCheck: typeCheck(req.body.email)
    }

    // Auth
    const request = await fetch(
      `${ws.service.auth.url}${ws.service.auth.path}?${queryString.stringify(
        ws.service.auth.params
      )}`,
      {
        method: 'POST',
        body: JSON.stringify(_merge(authParams, ws.service.auth.params)),
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const response = await request.json()

    if (response.status === 'OK') {
      const { data } = response
      const applicantId = base64.decode(data.applicantId)
      // Get CV
      try {
        const cvRequest = await fetch(
          `${ws.service.cv.url}${
            ws.service.cv.path
          }${applicantId}?${queryString.stringify(ws.service.cv.params)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        )
        const cvResponse = await cvRequest.json()
        // console.log('personalInfo', personalInfo)
        data.user = {
          firstName: _get(cvResponse, 'data.personalInfo.firstName', ''),
          middleName: _get(cvResponse, 'data.personalInfo.middleName', ''),
          lastName: _get(cvResponse, 'data.personalInfo.lastName', ''),
          maidenName: _get(cvResponse, 'data.personalInfo.maidenName', ''),
          email: _get(cvResponse, 'data.personalInfo.emails.primaryEmail', ''),
          picture: _get(cvResponse, 'data.personalInfo.picture', ''),
          phone: _get(
            _get(cvResponse, 'data.personalInfo.phoneNumbers', []).filter(
              phone => phone.place === 'mobile'
            ),
            '[0].number',
            ''
          ),
          role: 'applicant',
          cvUrl: `https://www.trabajando.cl/cvcandidato/${tbjCrypt(
            applicantId
          )}`
        }
        // New Session
        const token = await signJWT(data)
        console.log('BASE64', base64.encode('118838'))
        success(res)({
          jwt: token,
          user: data.user,
          applicantId: applicantId,
          tbjCrypt: tbjCrypt('118838'),
          tbjDecrypt: tbjDecrypt('o75mpYntSA93UTO0CNk1ONPiINKhKrM9UkNVrVY-YE8')
        })
      } catch (error) {
        console.log('error', error)
        fail(res)({
          message: 'Ocurrio un problema, intenta nuevamente. (-1)'
        })
      }
    } else {
      fail(res)({
        message: 'Los datos ingresados son incorrectos.'
      })
    }
  } catch (error) {
    console.log('error', error)
    fail(res)({
      message: 'Ocurrio un problema, intenta nuevamente.'
    })
  }
}

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

const authOfficer = async (req, res) => {
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
      success(res)({
        jwt: 'el-token-challa',
        user: officer
      })
    } else {
      fail(res)({
        message: 'Datos de usuario incorrectos, intente nuevamente.'
      })
    }

    /* .catch(error => {
        console.log('error', error)
        fail(res)({
          message: error
        })
      }) */
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
