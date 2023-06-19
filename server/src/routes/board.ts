import express from "express";
import { BoardResource } from "../services/ChannelResources";
import { getBoard } from '../services/ViewBoardService'
import { optionalAuthentication } from "./authentication";
import channel from "./channel";

const boardRouter = express.Router();

// * - alle eigenen (owned) Channels
// * - alle öffentlichen (public) Channels
boardRouter.get('/', optionalAuthentication,
    // param("channelId").isMongoId(),

    async (req, res, next) => {
        let board: BoardResource


        try {
            if (req.userId) { // wurde von optionalAuthentication in den Requestg geschrieben
                board = await getBoard(req.userId)

            } else {
                board = await getBoard()
            }

            res.send(board);
        } catch (err) {
            res.status(404)
            next(err);
        }
    });

export default boardRouter;