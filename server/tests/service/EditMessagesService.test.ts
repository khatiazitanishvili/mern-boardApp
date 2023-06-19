

import { Message } from "../../src/model/MessageModel";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { ChannelResource, MessageResource } from "../../src/services/ChannelResources";
import { createMessage, getMessage, updateMessage, deleteMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";

import DB from "../DB";


let user: UserResource
let channel: ChannelResource
let message: MessageResource

beforeAll(async () => await DB.connect())
beforeEach(async () => {
    user = await createUser({
        name: "john",
        email: "john@gmail.com",
        admin: true,
        password: "1234"
    })

    channel = await createChannel({
        name: "channel",
        description: "john's channel",
        ownerId: user.id!,
        public: true,
        closed: true
    })


    message = await createMessage({
        title: "john@doe.de",
        content: "John",
        authorId: user.id!,
        channelId: channel.id!
    })
})
afterEach(async () => await DB.clear())

afterAll(async () => await DB.close())

test("create Message", async () => {
    await deleteMessage(message.id!);
    const fetchedPerson = await Message.findById(message.id!);
    expect(fetchedPerson).toBeNull();
});

test("create Message", async () => {
    const messageOne = await createMessage({
        title: "John's 1st Message",
        content: "This is John's content",
        authorId: user.id!,
        channelId: channel.id!
    });
    expect(messageOne.title).toBe("John's 1st Message");
});

test("get Message", async () => {
    const s = await getMessage(message.id!)

    expect(s.title).toBe("john@doe.de");

});

test("update Message", async () => {
    const version1 = await createMessage({
        title: "John's 2nd Message",
        content: "This is John's 2nd content",
        authorId: user.id!,
        channelId: channel.id!
    })
    let version1Id = version1.id;

    let test: MessageResource = {
        id: version1Id,
        title: "john@doe.de",
        content: "John",
        authorId: user.id!,
        channelId: channel.id!
    }

    const b = await updateMessage(test)
    expect(b.title).toBe("john@doe.de");
    expect(b.content).toBe("John");

    //await deleteMessage(version1.id!)
    const mess = await Message.findById(version1.id!);
    if (!mess) {
        expect(mess).toBeNull();

    }
});



test("delete Message", async () => {
    const version1 = await createMessage({
        title: "John's 2st Message",
        content: "This is John's 2nd content",
        authorId: user.id!,
        channelId: channel.id!
    })
    const deleteM = await deleteMessage(version1.id!)
    expect(deleteM).toBeUndefined();
});


