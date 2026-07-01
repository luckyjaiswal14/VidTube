import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid video id")
    
    const skip = (Number(page) - 1) * Number(limit)
    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'fullName userName avatar')
    
    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched"))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body
        if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid video id")
        if (!content || !content.trim()) throw new ApiError(400, "content is required")
    
        const comment = await Comment.create({ content, video: videoId, owner: req.user._id })
        return res.status(201).json(new ApiResponse(201, comment, "Comment added"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
        if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, "Invalid comment id")
    
        const comment = await Comment.findById(commentId)
        if (!comment) throw new ApiError(404, "Comment not found")
        if (comment.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized")
    
        comment.content = content || comment.content
        await comment.save()
        return res.status(200).json(new ApiResponse(200, comment, "Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, "Invalid comment id")

    const comment = await Comment.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found")
    if (comment.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized")

    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}