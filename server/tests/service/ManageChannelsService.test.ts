import { Channel } from "../../src/model/ChannelModel";
import { Message } from "../../src/model/MessageModel";
import { User } from "../../src/model/UserModel";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { ChannelResource, MessageResource } from "../../src/services/ChannelResources";
import { createMessage } from "../../src/services/EditMessagesService";
import { getChannel, createChannel, updateChannel, deleteChannel } from "../../src/services/ManageChannelsService";
import { dateToString } from "../../src/services/ServiceHelper";
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



test("create Channel", async () => {
    const channelOne = await createChannel({
        name: "Channel 1",
        description: "This is my first Channel",
        ownerId: user.id!,
        public: true,
        closed: true
    });
    if (channelOne == null) {
        expect(channelOne).toBeNull()
    }

    expect(channelOne).toBeDefined()
    expect(channelOne.description).toBe("This is my first Channel")
    expect(channelOne.name).toBe("Channel 1")
})


test("get Channel", async () => {
    const s = await getChannel(channel.id!)
    expect(s.name).toBe("channel");
    expect(s.description).toBe("john's channel");
    expect(s.ownerId).toBe(user.id!);
    expect(s.public).toBe(true);
    expect(s.closed).toBe(true);

});

test("update Channel", async () => {
    const version2 = await getChannel(channel.id!)
    version2.name = "updated channel";
    const updatEd = await updateChannel(version2);

    expect(updatEd.name).toBe("updated channel");
    expect(updatEd.description).toBe("john's channel");
    expect(updatEd.ownerId).toBeDefined();
    expect(updatEd.public).toBe(true);
    expect(updatEd.closed).toBe(true);
})

test("delete Channel", async () => {
    const deleteM = await deleteChannel(channel.id!)
    expect(deleteM).toBeUndefined();
});









