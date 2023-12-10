const express = require('express')
const router = express.Router()
const controller = require('../controller/vet.controller')

router.get('/list', controller.get)
router.get('/get/:id', controller.getById)
router.post('/update/:id', controller.update)

module.exports = router