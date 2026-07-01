import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id")

    const existing = await Like.findOne({ video: videoId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unliked video"))
    }

    const like = await Like.create({ video: videoId, likedBy: req.user._id })
    return res.status(201).json(new ApiResponse(201, like, "Video liked"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment id")

    const existing = await Like.findOne({ comment: commentId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unliked comment"))
    }

    const like = await Like.create({ comment: commentId, likedBy: req.user._id })
    return res.status(201).json(new ApiResponse(201, like, "Comment liked"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet id")

    const existing = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unliked tweet"))
    }

    const like = await Like.create({ tweet: tweetId, likedBy: req.user._id })
    return res.status(201).json(new ApiResponse(201, like, "Tweet liked"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({ likedBy: req.user._id, video: { $exists: true } }).populate({ path: 'video', populate: { path: 'owner', select: 'fullName userName avatar' } })

    const videos = likes.map((l) => l.video).filter(Boolean)
    return res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
