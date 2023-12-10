const express = require('express')
const router = express.Router()
const controller = require('../controller/user.controller')
const validator = require('../validator/user/validation')
const upload = require('../middleware/multer')

// Routes
router.post('/register', validator.register, controller.register)
router.post('/login', validator.login, controller.login)
router.get('/get/:id', controller.getById)
router.get('/picture/:id', controller.getPicture)
router.post('/update-photo/:id', upload.single('picture'), controller.updatePicture)
router.post('/update/:id', controller.update)
router.post('/logout', controller.logout)

module.exports = router