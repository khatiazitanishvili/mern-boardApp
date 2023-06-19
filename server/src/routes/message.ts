import express from "express";
import { body, matchedData, param, validationResult } from "express-validator";
import { Message } from "../model/MessageModel"
import { MessageResource } from "../services/ChannelResources";
import { getMessage, createMessage, updateMessage, deleteMessage } from '../services/EditMessagesService'
import { optionalAuthentication, requiresAuthentication } from "./authentication";

const message = express.Router();

let MAX_LENGTH_LINE_STRING = 1000;
let MAX_LENGTH_NAME_STRING = 100;
// router.get('/message/:id', getMessage);
// router.post('/message/:id', createMessage);
// router.put('/message/:id',updateMessage);
// router.delete('/message/:id', deleteMessage);

// Get Message
message.get('/:messageId', optionalAuthentication,
    param("messageId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }
        const messageId = req.params?.messageId;
        try {
            const message = await getMessage(messageId)
            res.send(message);
        } catch (err) {
            res.status(404)
            next(err);
        }
    });



// Create Message
message.post('/', requiresAuthentication,
    param('id').optional().isMongoId(),
    body('title').isString().isLength({ max: MAX_LENGTH_NAME_STRING }),
    body('authorId').isMongoId(),
    body('author').optional().isString(),
    body('content').isString().isLength({ max: MAX_LENGTH_LINE_STRING }),
    body('channelId').isMongoId(),
    body('createdAt').optional().isString(),


    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400)
                .json({ errors: errors.array() });
        }
        try {
            const messageData = matchedData(req) as MessageResource;
            const createdMessage = await createMessage(messageData)
            res.send(createdMessage);
        } catch (err) {
            res.status(404)
            next(err);
        }
    })




message.put('/:messageId', requiresAuthentication,
    param("messageId").isMongoId(),
    body('title').isString().isLength({ max: 100 }),
    body('author').optional().isString(),
    // body('authorId').isMongoId(),
    body('content').isString().isLength({ max: 1000 }),
    body('createdAt').optional().isString(),
    body('channelId').isMongoId(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400)
                .json({ errors: errors.array() });
        }

        const messageId = req.params?.messageId;
        const message = await Message.findById(messageId);
        if (!message) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (message.author.toString() !== req.userId) {
            res.status(401).send("Not your message");
            return;
        }

        try {
            const updatedMessage = await updateMessage(req.body);
            res.send(updatedMessage);
        } catch (err) {
            res.status(400).send(err)
        }
    })


// Delete User
message.delete('/:messageId', requiresAuthentication,
    param("messageId").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400)
                .json({ errors: errors.array() });
        }

        const messageId = req.params?.messageId;
        const message = await Message.findById(messageId);
        if (!message) {
            res.sendStatus(404);
            return;
        }
        // Autorisierung
        if (message.author.toString() !== req.userId) {
            res.status(401).send("Not your message");
            return;
        }
        try {
            const deletedMessage = await deleteMessage(messageId);
            res.send(deletedMessage);
        } catch (err) {
            res.status(404)
            next(err);
        }
    })

export default message;