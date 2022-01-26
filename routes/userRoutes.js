const express = require('express')
const userRouter = express.Router()
const { registerUser, authUser, deleteUser, updateUserProfile, allUsersProfile } = require("../controllers/usercontroller")
const { protect } = require('../middlewares/authMiddleware')

userRouter.route('/allusersprofile').get(allUsersProfile)
userRouter.route('/register').post(registerUser)
userRouter.route('/signin').post(authUser)
userRouter.route("/profile/").post(protect, updateUserProfile);
userRouter.route('/:id').delete(deleteUser)


module.exports = userRouter
