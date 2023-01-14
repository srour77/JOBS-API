const jobModel = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors/index')

const getAllJobs = async function (req, res) {
    const jobs= await jobModel.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json(jobs)
}

const getJob = async function (req, res) {
    const userId = req.user.userId
    const jobId = req.params.id
    const job = await jobModel.findOne({createdBy: userId, _id: jobId})
    if(!job){
        throw new NotFoundError(`no such job with this id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

const createJob = async function (req, res) {
    req.body.createdBy = req.user.userId
    const job = await jobModel.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async function (req, res) {
    const userId = req.user.userId
    const jobId = req.params.id
    const {company, position} = req.body
    if(!company || !position){
        throw new BadRequestError('position or company should be provided')
    }
    const job = await jobModel.findByIdAndUpdate({_id: jobId, createdBy: userId},
        req.body, {new: true, runValidators: true})
    if(!job){
        throw new NotFoundError(`no such job with this id ${jobId}`)
    }
    res.status(StatusCodes.CREATED).json(job)
}

const deleteJob = async function (req, res) {
    const userId = req.user.userId
    const jobId = req.params.id
    const job = await jobModel.findByIdAndDelete({_id: jobId, createdBy: userId})
    if(!job){
        throw new NotFoundError(`no such job with this id ${jobId}`)
    }
    res.status(StatusCodes.OK).json('done! job has been deleted')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}