const express = require('express')
const router = express.Router()
const {getAllUsers,creatUser,updateUser,deleteUser} = require('../contorller/usersController')
router.route('/')
.get(getAllUsers)
.post(creatUser)
.patch(updateUser)
.delete(deleteUser)

module.exports = router