import express from "express";
import { createChannel, deleteChannel, getChannel, updateChannel } from "../services/ManageChannelsService";
import { body, matchedData, param, validationResult, } from 'express-validator';
import { ChannelResource } from "../services/ChannelResources";
import { optionalAuthentication, requiresAuthentication } from "./authentication";

const ChannelRouter = express.Router();

ChannelRouter.get("/:channelId", optionalAuthentication,
    param("channelId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }
        try {
            const channelData = matchedData(req) as ChannelResource & { channelId: string };
            const channel = await getChannel(channelData.channelId);
            res.send(channel);
        } catch (err) {
            res.status(404);
            next(err);
        }
    })

ChannelRouter.post("/", requiresAuthentication,
    body('name').isString().isLength({ min: 3, max: 100 }),
    body('description').isString().isLength({ min: 3, max: 1000 }),
    body('ownerId').isMongoId(),
    body('public').isBoolean(),
    body('closed').isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const channelData = matchedData(req) as ChannelResource & { ownerId: string };
            const channel = await createChannel(channelData);
            res.send(channel);
        } catch (err) {
            res.status(400);
            next(err);
        }
    })

ChannelRouter.put("/:channelId", requiresAuthentication,
    param("channelId").isMongoId(),
    body('name').isString().isLength({ min: 3, max: 100 }),
    body('description').isString().isLength({ min: 3, max: 1000 }),
    body('owner').optional().isString().isLength({ min: 3, max: 100 }),
    body('ownerId').isMongoId(),
    body('id').isMongoId(),
    body('public').isBoolean(),
    body('closed').isBoolean(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }
        try {
            const channelData = matchedData(req) as ChannelResource & { ownerid: string, channelId: string };
            const channelIdDataReq = req.params?.channelId;
            const channelDataMatched = channelData;
            const userId = req.userId;
            const ownerId = channelData.ownerId;

            if (channelIdDataReq !== channelDataMatched.channelId) {
                res.status(400);
                throw new Error("id not the same");
            }

            if (userId !== ownerId) {
                res.status(403);
                throw new Error("Not the Owner");
            }

            const updatedChannel = await updateChannel(channelData);
            res.send(updatedChannel);
        } catch (err) {
            res.status(400);
            next(err);
        }
    })

ChannelRouter.delete("/:channelId", requiresAuthentication,
    param("channelId").isMongoId(),
    body('id').isMongoId(),
    body('ownerId').isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }

        try {
            const channelData = matchedData(req) as ChannelResource & { ownerid: string, channelId: string };
            const channelIdDataReq = req.params?.channelId;
            const channelDataMatched = channelData;
            const userId = req.userId;
            const ownerId = channelData.ownerId;

            if (userId !== ownerId) {
                res.status(403);
                throw new Error("Not the Owner");
            }

            if (channelIdDataReq !== channelDataMatched.channelId) {
                res.status(400);
                throw new Error("id not the same");
            }
            const removeChannel = await deleteChannel(channelData.channelId);
            res.send(removeChannel);
        } catch (err) {
            res.status(404);
            next(err);

        }
    })

export default ChannelRouter;
