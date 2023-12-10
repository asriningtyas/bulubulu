const express = require('express')
const router = express.Router()
const controller = require('../controller/schedule.controller')

router.post('/create', controller.create)
router.get('/list', controller.getData)
router.get('/list/:status/:by/:id', controller.getByIds)
router.post('/change-status', controller.changeStatus)
router.post('/cancel', controller.cancel)
router.post('/finish', controller.finish)
router.get('/tes', controller.tes)

module.exports = router