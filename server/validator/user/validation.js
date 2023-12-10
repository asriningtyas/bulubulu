const response = require('../../utils/response');
const schema = require('./schema')

module.exports = {
    // validate register
    register: (req, res, next) => {
        const value = schema.register.validate(req.body)
        if(value.error) {
            return response({
                res, statusCode: 422, message: value.error.details[0].message, data: req.body, type: 'ERROR', name: 'register user'
            });
        } else {
            next()
        }
    },
    // validate login
    login: (req, res, next) => {
        const value = schema.login.validate(req.body)
        if(value.error) {
            return response({
                res, statusCode: 422, message: value.error.details[0].message, data: req.body, type: 'ERROR', name: 'register user'
            });
        } else {
            next()
        }
    }
}