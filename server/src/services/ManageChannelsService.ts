// import { Types } from "mongoose";
// import { Channel } from "../model/ChannelModel";
// import { Message } from "../model/MessageModel";
// import { IUser, User } from "../model/UserModel";
// import { ChannelResource } from "./ChannelResources";
// import { dateToString } from "./ServiceHelper";

// /**
//  * Liefer den Channel mit angegebener ID. Falls kein Channel gefunden wurde, wird
//  * ein Fehler geworfen.
//  */
// export async function getChannel(id: string): Promise<ChannelResource> {
//     // Beachten Sie die Hinweise im Aufgabenblatt!
//     // throw new Error("getChannel not implemented yet")
//     const channel = await Channel.findById(id)
//         .populate<{ owner: IUser & { id: string } }>("owner")
//         .exec();

//     if (!channel) {
//         throw new Error(`No channel with the id ${id} found.`);
//     }

//     const messages = await Message.find({ channel: channel }).exec();
//     let messageCount = 0;
//     if (messages) {
//         messageCount = messages.length;
//     }

//     return {
//         id: channel.id.toString(),
//         name: channel.name,
//         description: channel.description,
//         owner: channel.owner.name,
//         ownerId: channel.owner.id,
//         createdAt: dateToString(channel.createdAt),
//         messageCount: messageCount,
//         public: channel.public,
//         closed: channel.closed
//     }
// }

// /**
//  * Erzeugt den Channel.
//  */
// export async function createChannel(channelResource: ChannelResource): Promise<ChannelResource> {
//     // Beachten Sie die Hinweise im Aufgabenblatt!
//     // throw new Error("createChannel not implemented yet")
//     const user = await User.findById(channelResource.ownerId).exec();
//     if (!user) {
//         throw new Error('Owner might not exist.');
//     }

//     const channelNew = new Channel({
//         name: channelResource.name,
//         description: channelResource.description,
//         public: channelResource.public,
//         closed: channelResource.closed,
//         owner: user,
//         members: []
//     });
//     await channelNew.save();

//     // const check = await Channel.findById(channelNew.id)
//     //     .populate<{ owner: IUser & { id: string } }>("owner")
//     //     .exec();

//     // if (!check) {
//     //     throw new Error('Failed to create channel.') // cannot be tested
//     // }

//     return {
//         id: channelNew.id,
//         name: channelNew.name,
//         description: channelNew.description,
//         owner: user.name,
//         ownerId: channelNew.owner.toString(),
//         createdAt: dateToString(channelNew.createdAt),
//         messageCount: 0,
//         public: channelNew.public,
//         closed: channelNew.closed
//     }
// }

// /**
//  * Ändert die Daten eines Channels.
//  * Aktuell können nur folgende Daten geändert werden: name, description, public, closed.
//  * Falls andere Daten geändert werden, wird dies ignoriert.
//  */
// export async function updateChannel(channelResource: ChannelResource): Promise<ChannelResource> {
//     // Beachten Sie die Hinweise im Aufgabenblatt!
//     // throw new Error("updateChannel not implemented yet")
//     const channelUpdated = await Channel.findById(channelResource.id)
//         .populate<{ owner: IUser & { id: string } }>("owner")
//         .exec();
//     if (!channelUpdated) {
//         throw new Error(`No channel with id ${channelResource.id} found`);
//     }
//     channelUpdated.name = channelResource.name,
//         channelUpdated.description = channelResource.description,
//         channelUpdated.public = channelResource.public,
//         channelUpdated.closed = channelResource.closed
//     await channelUpdated.save();

//     return {
//         id: channelUpdated.id,
//         name: channelUpdated.name,
//         description: channelUpdated.description,
//         owner: channelResource.owner,
//         ownerId: channelUpdated.owner.id,
//         createdAt: channelResource.createdAt,
//         messageCount: channelResource.messageCount,
//         public: channelUpdated.public,
//         closed: channelUpdated.closed
//     }
// }

// /**
//  * Beim Löschen wird der Channel über die ID identifiziert. Falls Channel nicht gefunden wurde (oder aus
//  * anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
//  */
// export async function deleteChannel(id: string): Promise<void> {
//     // Beachten Sie die Hinweise im Aufgabenblatt!
//     // throw new Error("deleteChannel not implemented yet")
//     const chcekChannel = await Channel.findById(id).exec();

//     if (!chcekChannel) {
//         throw new Error(`No channel with the id ${id} found.`);
//     }

//     const res = await Channel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
//     // if(!res.acknowledged) {
//     //     throw new Error('Failed to delete channel.') // cannot be tested
//     // }
//     // const foundAfterDelete = await Channel.findById(id);
//     // if (foundAfterDelete) {
//     //     throw new Error('Channel might not be deleted.') // cannot be tested
//     // }
// }


import { Channel, IChannel } from "../model/ChannelModel";
import { IUser } from "../model/UserModel";
import { ChannelResource } from "./ChannelResources";
import { dateToString } from "./ServiceHelper";
import { Message } from "../model/MessageModel";

/**
 * Liefer den Channel mit angegebener ID. Falls kein Channel gefunden wurde, wird
 * ein Fehler geworfen.
 */
export async function getChannel(id: string): Promise<ChannelResource> {
    // Beachten Sie die Hinweise im Aufgabenblatt!
    const channel = await Channel.findById(id)
        .populate<{ owner: IUser & { id: string, name: string } }>("owner")
        .exec();


    if (channel) {
        const message = await Message.find({ channel: channel.id }).exec();
        return {
            id: channel.id,
            name: channel.name,
            description: channel.description,
            owner: channel.owner.name,
            ownerId: channel.owner.id,
            createdAt: dateToString(channel.createdAt),
            messageCount: message.length,
            public: channel.public,
            closed: channel.closed
        }
    } else {
        throw new Error("Channel not found!");
    }
}

/**
 * Erzeugt den Channel.
 */
export async function createChannel(channelResource: ChannelResource): Promise<ChannelResource> {
    // Beachten Sie die Hinweise im Aufgabenblatt!
    const channel = await Channel.create({
        name: channelResource.name,
        description: channelResource.description,
        owner: channelResource.ownerId,
        public: channelResource.public,
        closed: channelResource.closed
    })

    const channelOfUser = await channel.populate<{ owner: IChannel & { id: string, name: string } }>("owner")

    return {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        owner: channelOfUser.owner.name,
        ownerId: channelOfUser.owner.id,
        createdAt: dateToString(channel.createdAt),
        messageCount: 0,
        public: channel.public,
        closed: channel.closed
    }
}

/**
 * Ändert die Daten eines Channels.
 * Aktuell können nur folgende Daten geändert werden: name, description, public, closed.
 * Falls andere Daten geändert werden, wird dies ignoriert.
 */
export async function updateChannel(channelResource: ChannelResource): Promise<ChannelResource> {
    // Beachten Sie die Hinweise im Aufgabenblatt!

    const update = { name: channelResource.name, description: channelResource.description, public: channelResource.public, closed: channelResource.closed }

    await Channel.updateOne({ id: channelResource.id }, update);
    const channel = await Channel.findOne({ id: channelResource.id })
        .populate<{ owner: IUser & { id: string, name: string } }>("owner")
        .exec();

    if (!channel) {
        throw new Error("Channel does not exist");
    }

    channel.name = channelResource.name;
    channel.description = channelResource.description;
    channel.public = channelResource.public;
    channel.closed = channelResource.closed;

    const savedChannel = await channel.save();
    const message = await Message.find({ channel: channel.id }).exec();
    return {
        id: channel.id,
        name: savedChannel.name,
        description: savedChannel.description,
        owner: channel.owner.name,
        ownerId: channel.owner.id,
        createdAt: dateToString(channel.createdAt),
        messageCount: message.length,
        public: savedChannel.public,
        closed: savedChannel.closed
    }
}

/**
 * Beim Löschen wird der Channel über die ID identifiziert. Falls Channel nicht gefunden wurde (oder aus
 * anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
 */
export async function deleteChannel(id: string): Promise<void> {
    // Beachten Sie die Hinweise im Aufgabenblatt!
    if (!await Channel.findById(id)) {
        throw new Error("Channel does not exist")
    }
    await Channel.deleteOne({ _id: id });
}

