import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const totalVideos = await Video.countDocuments({ owner: userId })

    const viewsAgg = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ])

    const totalViews = viewsAgg?.[0]?.totalViews || 0

    const totalSubscribers = await Subscription.countDocuments({ channel: userId })

    // total likes on user's videos
    const videos = await Video.find({ owner: userId }).select('_id')
    const videoIds = videos.map(v => v._id)
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

    const stats = { totalVideos, totalViews, totalSubscribers, totalLikes }
    return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const videos = await Video.find({ owner: userId }).populate('owner', 'fullName userName avatar')
    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"))
})

export {
    getChannelStats, 
    getChannelVideos
}