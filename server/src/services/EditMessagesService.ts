import { IMessage, Message } from "../model/MessageModel";
import { IUser, User } from "../model/UserModel";
import { ChannelResource, MessageResource } from "./ChannelResources";
import { dateToString } from "./ServiceHelper";
import { Types } from "mongoose"
import { Channel, IChannel } from "../model/ChannelModel";


/**
 * Liefert die Message in angegebener ID. Falls keine Message gefunden wurde, wird ein Fehler
 * geworfen.
 */


export async function getMessage(id: string): Promise<MessageResource> {

    const message = await Message.findById(id)
        .populate<{ author: IUser & { id: string } }>("author")
        .populate<{ channel: IChannel & { id: string } }>("channel").exec();


    if (!message) {
        throw new Error(`No message with id ${id} found`);
    }

    return {
        id: message.id,
        title: message.title,
        authorId: message.author.id,
        author: message.author.name,
        createdAt: dateToString(message?.createdAt),
        content: message.content,
        channelId: message.channel.id

    }
}

/**
 * Erzeugt eine Message, dafür werden Titel, Content und die IDs von Autor und Channel benötigt.
 */
export async function createMessage(messageResource: MessageResource): Promise<MessageResource> {

    const author = await User.findById(messageResource.authorId).exec()
    if (!author) {
        throw new Error('User not found')
    }
    const channel = await Channel.findById(messageResource.channelId).exec()
    if (!channel) {
        throw new Error('Channel not found')
    }

    const message = await new Message({
        title: messageResource.title, content: messageResource.content,
        author: author, channel: channel
    });
    const savedMessage = await message.save();

    return {
        id: savedMessage.id,
        title: savedMessage.title,
        author: author!.name,
        authorId: author!.id,
        createdAt: dateToString(message.createdAt),
        content: savedMessage.content,
        channelId: channel!.id

    }
}
/**
 * Updated eine Message. Es können nur Titel und Content geändert werden.
 * Aktuell können Messages nicht von einem Channel in einen anderen verschoben werden.
 * Auch kann der Autor nicht geändert werden.
 * Falls der Channel oder Autor geändert wurde, wird dies ignoriert.
 */
export async function updateMessage(messageResource: MessageResource): Promise<MessageResource> {
    const message = await Message.findById(messageResource.id)
        .populate<{ author: IUser & { id: string } }>("author")
        .populate<{ channel: IChannel & { id: string } }>("channel")
        .exec();
    if (!message) {
        // Beachten Sie die Hinweise im Aufgabenblatt!
        throw new Error(`No message with id ${messageResource.id} found, cannot update`)
    }

    // const authorID = await User.findById(messageResource.authorId)
    // const channelID = await Channel.findById(messageResource.channelId)

    message.title = messageResource.title;
    message.content = messageResource.content;
    await message.save();
    return {
        id: message.id,
        title: message.title,
        author: message.author.name,
        authorId: message.author.id,
        createdAt: dateToString(message.createdAt),
        content: message.content,
        channelId: message.channel.id
    }
}
/**
 * Beim Löschen wird die Message über die ID identifiziert. Falls Message nicht gefunden wurde (oder aus
 * anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
 */
export async function deleteMessage(id: string): Promise<void> {
    const find = await Message.findById(id).exec();
    if (!find) {
        throw new Error(`Message with id ${id} not found`)
    }

    const message = await Message.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    if (!message) {
        throw new Error("Message can not delete")

    }

}