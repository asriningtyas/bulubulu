const joi = require('joi')

module.exports = {
    // request validation for register
    register: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        fullName: joi.string(),
        email: joi.string().email(),
        role: joi.string().valid('user', 'vet'),
    }),
    // request validation for login
    login: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    }),
}