
import supertest from "supertest";
import app from "../../src/app"
import { IChannel } from "../../src/model/ChannelModel";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { ChannelResource, MessageResource } from "../../src/services/ChannelResources";
import { createMessage, updateMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";

import DB from "../DB";
import { prepareJWTAccessToken } from "./JWTPreparedSuperTest";
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
const NON_EXISTING_MONGOID = "635";

let john: UserResource
let message1: MessageResource
let channel1: ChannelResource

beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    john = await createUser({ name: "John", email: "john@doe.de", password: "123", admin: false })
    channel1 = await createChannel({ name: "John's channel", description: "none", public: true, ownerId: john.id!, closed: false })
    message1 = await createMessage({ title: "Message ", content: "no content for message ", authorId: john.id!, channelId: channel1.id! })
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

//Validator
test("NON_EXISTING_CHANNELID delete validator", async () => {
    const request = supertest(app);
    const response = await request.delete(`/channel/${NON_EXISTING_MONGOID}`);
    expect(response.statusCode).toBe(401);
});

test("NON_EXISTING_CHANNELID get validator", async () => {
    const request = supertest(app);
    const response = await request.get(`/channel/${NON_EXISTING_MONGOID}`);
    expect(response.statusCode).toBe(400);
});

test("channel PUT validator", async () => {

    const user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")
    const channel = await createChannel({ name: "User's Channel", description: "Description", ownerId: user.id!, closed: false, public: true })

    const newChannel: ChannelResource = ({
        id: NON_EXISTING_MONGOID,
        name: "User Channel",
        description: "Description updated",
        ownerId: user.id!,
        closed: false,
        public: true
    })

    const request = supertest(app)
    const response = await request.put(`/channel/${channel.id}`).send(newChannel);

    expect(response.statusCode).toBe(401)

})

test("channel POST", async () => {
    let user: UserResource

    user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    const newChannel: ChannelResource = ({
        name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        description: "This is my Channel",
        ownerId: user.id!,
        closed: false,
        public: true
    })

    const request = supertest(app)
    const response = await request.post(`/channel`).send(newChannel);

    const mes = response.body;

    expect(response.statusCode).toBe(401)

})



