
import { Channel } from "../model/ChannelModel";
import { IMessage, Message } from "../model/MessageModel";
import { IUser, User } from "../model/UserModel";
import { BoardResource } from "./ChannelResources";
import { dateToString } from "./ServiceHelper";

/**
 * Gibt alle Channels zurück, die für einen User sichtbar sind. Dies sind:
 * - alle eigenen (owned) Channels
 * - alle öffentlichen (public) Channels
 * 
 * Den folgenden Fall ignorieren wir hier zunächst:
 * - alle Channels, in denen der User als Member eingetragen ist.
 */
export async function getBoard(userId?: string): Promise<BoardResource> {
    // Beachten Sie die Hinweise im Aufgabenblatt!
    // throw new Error("getBoard not implemented yet")

    let board;

    if (userId) {
        const user = await User.findById(userId).exec();

        if (!user) {
            throw new Error(`No user with id ${userId} found.`);
        }

        board = await Channel.find({ $or: [{ public: true }, { owner: user._id }] })
            .populate<{ owner: IUser & { id: string } }>("owner")
            .exec();
    }
    else {
        board = await Channel.find({ public: true })
            .populate<{ owner: IUser & { id: string } }>("owner")
            .exec();

    }

    if (board.length < 1) {
        throw new Error('No channels found.');
    }

    return {
        channels: await Promise.all(board.map(async (channel) => {

            const messages = await Message.find({ channel: channel }).exec();
            let messageCount = 0;
            if (messages) {
                messageCount = messages.length;
            }

            return {
                id: channel.id,
                name: channel.name,
                description: channel.description,
                owner: channel.owner.name,
                ownerId: channel.owner.id,
                createdAt: dateToString(channel.createdAt),
                messageCount: messageCount,
                public: channel.public,
                closed: channel.closed
            }
        }))
    }
}