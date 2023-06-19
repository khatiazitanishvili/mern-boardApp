import express from "express";
import { param, validationResult } from "express-validator";
import { Channel } from "../model/ChannelModel";
import { getMessages } from "../services/ManageChannelsServiceGetMessages";
import { optionalAuthentication } from "./authentication";

const messagesRouter = express.Router();

messagesRouter.get("/channel/:channelId/messages", optionalAuthentication,
    param("channelId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const channelId = req.params?.channelId;
        const channel = await Channel.findById(channelId);
        if (!channel) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (channel.owner.toString() !== req.userId && !channel.public) {
            res.status(403).send("Not your channel");
            return;
        }
        try {
            const messages = await getMessages(channelId);
            res.send(messages); // 200 by default
        } catch (err) {
            res.status(404);
            next(err);
        }
    })

export default messagesRouter;