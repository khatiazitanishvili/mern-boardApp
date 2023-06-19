import { Channel } from "../../src/model/ChannelModel";
import { Message } from "../../src/model/MessageModel";
import { User } from "../../src/model/UserModel";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { ChannelResource, MessageResource } from "../../src/services/ChannelResources";
import { createMessage } from "../../src/services/EditMessagesService";
import { getChannel, createChannel, updateChannel, deleteChannel } from "../../src/services/ManageChannelsService";
import { dateToString } from "../../src/services/ServiceHelper";
import DB from "../DB";
import { getBoard } from "../../src/services/ViewBoardService";





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




test("get channels", async () => {

    const channel1 = await createChannel({
        name: "channel2",
        description: "john's 2nd channel",
        ownerId: user.id!,
        public: true,
        closed: true
    });


    const channels = await getBoard(user.id!)
    expect(channels).toBeDefined()
})