import { Types } from "mongoose";
import { Channel } from "../model/ChannelModel";
import { IMessage, Message } from "../model/MessageModel";
import { IUser } from "../model/UserModel";
import { MessageResource } from "./ChannelResources";
import { dateToString } from "./ServiceHelper";

/**
 * Alle Messages eines Channels.
 */
 export type MessagesResource = {
    messages: MessageResource[];
}

/**
 * Gibt alle Messages eines Channels zurück.
 */
export async function getMessages(channelId: string): Promise<MessagesResource> {
    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw new Error("Channel not found");
    }

    const messages = await Message.find({ channel: channelId })
        .populate<{ author: IUser & { id: string } }>('author')
        .exec();
    const msgRes = { messages: await toMessageResArray(messages) }
    return msgRes;
}


async function toMessageResArray(messages: (Omit<import("mongoose").Document<unknown, any, IMessage> & IMessage & { _id: Types.ObjectId; }, "author"> & { author: IUser & { id: string; }; })[]) {
    return await Promise.all(messages.map(async (message) => ({
        id: message.id,
        title: message.title,
        content: message.content,
        author: message.author.name,
        authorId: message.author.id,
        createdAt: dateToString(message.createdAt),
        channelId: message.channel.toString()
    })));
}

