import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id")
    if (channelId === req.user._id.toString()) throw new ApiError(400, "Cannot subscribe to yourself")

    const existing = await Subscription.findOne({ channel: channelId, subscriber: req.user._id })
    if (existing) {
        await Subscription.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed"))
    }

    const sub = await Subscription.create({ channel: channelId, subscriber: req.user._id })
    return res.status(201).json(new ApiResponse(201, sub, "Subscribed"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id")

    const subs = await Subscription.find({ channel: channelId }).populate('subscriber', 'fullName userName avatar')
    return res.status(200).json(new ApiResponse(200, subs.map(s => s.subscriber), "Subscribers fetched"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber id")

    const subs = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'fullName userName avatar')
    return res.status(200).json(new ApiResponse(200, subs.map(s => s.channel), "Subscribed channels fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
