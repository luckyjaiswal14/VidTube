import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const filter = {}
    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId
    }

    const sort = {}
    if (sortBy) sort[sortBy] = sortType === "asc" ? 1 : -1

    const skip = (Number(page) - 1) * Number(limit)

    const videos = await Video.find(filter)
        .sort(Object.keys(sort).length ? sort : { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'fullName userName avatar')

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if (!title || !description) throw new ApiError(400, "title and description are required")

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) throw new ApiError(400, "video and thumbnail files are required")

    const videoUpload = await uploadOnCloudinary(videoLocalPath)
    const thumbUpload = await uploadOnCloudinary(thumbnailLocalPath)

    const duration = Number(req.body.duration) || 0

    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbUpload.url,
        title,
        description,
        duration,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, video, "Video published"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const video = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true }).populate('owner', 'fullName userName avatar')
    if (!video) throw new ApiError(404, "Video not found")

    return res.status(200).json(new ApiResponse(200, video, "Video fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")
    if (video.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized")

    const { title, description } = req.body
    if (title) video.title = title
    if (description) video.description = description

    if (req.file?.path) {
        const thumb = await uploadOnCloudinary(req.file.path)
        if (thumb?.url) video.thumbnail = thumb.url
    }

    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "Video updated"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")
    if (video.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized")

    await Video.findByIdAndDelete(videoId)
    return res.status(200).json(new ApiResponse(200, {}, "Video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")
    if (video.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized")

    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "Publish status toggled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
