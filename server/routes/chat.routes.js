const express = require('express')
const router = express.Router()
const controller = require('../controller/chat.controller')

router.get('/room-id', controller.generateRoomId)
router.get('/get/:userId/:vetId', controller.getById)
router.get('/vet-list-chat/:vetId', controller.getByVetId)

module.exports = router