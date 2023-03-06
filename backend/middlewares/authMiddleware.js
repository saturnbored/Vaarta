const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await userModel.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed. Please try again.');
        }
    } else {
        res.status(401);
        throw new Error('Unknown user. Please login');
    }
});

module.exports = authMiddleware;