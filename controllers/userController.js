const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
const userData = require('../userData')
const { OAuth2Client } = require('google-auth-library');

// all users profiles
const allUsersProfile = asyncHandler(async (req, res) => {
    // if we want to get registerd users (ayal,timor,shadi all admins)
    // await User.insertMany(userData.users);

    const data = await User.find({});
    return res.status(200).send(data)
})

// get user by id
const getUserById = asyncHandler((req, res) => {
    const id = req.params.id
    User.find({ _id: id }, (err, data) => {
        if (err) throw err
        res.status(200).send(data)
    })
})

// register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic, isAdmin } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(404);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
        isAdmin,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

// auth User (signin)
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Email or Password!')
    }
})

// update User
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email, password, pic } = req.body;
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.pic = pic || user.pic;
        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});


// delete user
const deleteUser = asyncHandler((req, res) => {
    const _id = req.params.id;
    User.findByIdAndDelete(_id, (err, data) => {
        if (err) throw err;
        if (data) {
            return res.status(200).json({ deletedObj: data });
        }
        return res.status(400).json({ deletedObj: 'Not Found' })
    })
})

module.exports = {
    registerUser,
    authUser,
    allUsersProfile,
    getUserById,
    updateUserProfile,
    deleteUser,
}