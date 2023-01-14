const userModel = require('../models/User')
const {StatusCodes} =require('http-status-codes')
const {UnauthenticatedError, BadRequestError} = require('../errors/index')

const login = async function(req, res) {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }
    const user = await userModel.findOne({email})
    if(user && await user.verifyPassword(password)){
        const token = user.createJwt()
        return res.status(StatusCodes.OK).json({msg: 'logged in',
            user: {id: user._id, name: user.name}, token})
    }
    throw new UnauthenticatedError('please provide valid credentials')
}

const register = async function(req, res) {
    let user = await userModel.create(req.body)
    const token = user.createJwt()
    res.status(StatusCodes.CREATED).json({msg: 'registered',
        user: {id: user._id, name: user.name}, token})
}

module.exports = {
    login,
    register
}