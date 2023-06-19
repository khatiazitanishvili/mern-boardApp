
import supertest from "supertest";
import app from "../../src/app"
import { IMessage } from "../../src/model/MessageModel";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { ChannelResource, MessageResource } from "../../src/services/ChannelResources";
import { createMessage, updateMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";
import { MessagesResource } from "../../src/services/ManageChannelsServiceGetMessages";

import DB from "../DB";
import { jwtSuperTest, prepareJWTAccessToken } from "./JWTPreparedSuperTest";
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
const NON_MONGO_ID = "1";
let NON_MESSAGE!: MessageResource




let user1: UserResource
let message1: MessageResource
let channel1: ChannelResource

beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    user1 = await createUser({ name: "John", email: "john@doe.de", password: "123", admin: false })
    await prepareJWTAccessToken("john@doe.de", "123")
    channel1 = await createChannel({ name: "John's channel", description: "none", public: true, ownerId: user1.id!, closed: false })
    message1 = await createMessage({ title: "Message ", content: "no content for message ", authorId: user1.id!, channelId: channel1.id! })
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

// EXERCISE get
test("message GET", async () => {
    const message = await updateMessage(message1)

    const request = supertest(app);
    const response = await request.get(`/message/${message.id}`);
    expect(response.statusCode).toBe(200);
});

test("NON EXISTING MESSAGE get", async () => {
    const request = supertest(app);
    const response = await request.get(`/message/${NON_EXISTING_ID}`);
    expect(response.statusCode).toBe(404);
});

test("NON_EXISTING_MESSAGE get validator", async () => {
    const request = supertest(app);
    const response = await request.get(`/message/${NON_MONGO_ID}`);
    expect(response.statusCode).toBe(400);
});




// EXERCISE post
test("message POST1", async () => {
    let user: UserResource
    let channel: ChannelResource

    user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")

    channel = await createChannel({ name: "User's Channel", description: "Try first", ownerId: user.id!, closed: false, public: true })
    const newMessage: MessageResource = ({ title: "User's new Message", content: "new Message", authorId: user.id!, channelId: channel.id! })

    const response = await jwtSuperTest(app).post(`/message`).send(newMessage)

    const mes = response.body;

    expect(response.statusCode).toBe(200)
    expect(mes.title).toBe("User's new Message")

})


test("NON_EXISTING_MESSAGE post", async () => {
    const response = await jwtSuperTest(app).post(`/message`);
    expect(response.statusCode).toBe(400);
});

test("NON_EXISTING_MESSAGE_DATA post", async () => {

    const request = supertest(app);
    const response = await request.get(`/message`).send(NON_MESSAGE);
    expect(response.statusCode).toBe(404);
});



// EXERCISE put
test("NON EXISTING USER put", async () => {
    const response = await jwtSuperTest(app).put(`/message/${NON_EXISTING_ID}`);
    expect(response.statusCode).toBe(400);
});

test("message PUT", async () => {

    const user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")

    const channel = await createChannel({ name: "User's Channel", description: "Try first", ownerId: user.id!, closed: false, public: true })
    const message = await createMessage({ title: "User's new Message", content: "new Message", authorId: user.id!, channelId: channel.id! })

    const newMessage: MessageResource = ({
        id: message.id,
        title: "User's updated Message",
        content: "new Message",
        authorId: user.id!,
        channelId: channel.id!
    })
    const response = await jwtSuperTest(app).put(`/message/${message.id}`).send(newMessage)


    const mes = response.body;

    expect(response.statusCode).toBe(200)
    expect(mes.title).not.toEqual(message.title)
    expect(mes.id).toEqual(message.id)
    expect(mes.content).toEqual(message.content)
    expect(mes.authorId).toEqual(message.authorId)
    expect(mes.channelId).toEqual(message.channelId)
})


test("message PUT !author", async () => {
    let user: UserResource
    let channel: ChannelResource

    user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")

    channel = await createChannel({ name: "User's Channel", description: "Try first", ownerId: user.id!, closed: false, public: true })
    const message = await createMessage({ title: "User's new Message", content: "new Message", authorId: user.id!, channelId: channel.id! })

    const response = await jwtSuperTest(app).put(`/message/${message1.id}`).send(message1)

    const mes = response.body;

    expect(response.statusCode).toBe(401);

})

test("NON_EXISTING_MONGOID put", async () => {
    const NON_EXISTING_MESSAGE = "kleo"
    const response = await jwtSuperTest(app).put(`/message/${NON_MONGO_ID}`).send(message1);

    expect(response.statusCode).toBe(400);
});

test("NON EXISTING MESSAGE put", async () => {
    const response = await jwtSuperTest(app).put(`/message/${NON_EXISTING_ID}`).send(message1);
    expect(response.statusCode).toBe(404);
});

test("NON EXISTING MESSAGE and NON EXISTING ID put", async () => {
    const NON_EXISTING_MESSAGE = "kleo";
    const response = await jwtSuperTest(app).put(`/message/${NON_EXISTING_ID}`).send(NON_EXISTING_MESSAGE);
    expect(response.statusCode).toBe(400);
});

// EXERCISE delete
test("message DELETE", async () => {
    let user: UserResource
    let channel: ChannelResource

    user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")

    channel = await createChannel({ name: "User's Channel", description: "Try first", ownerId: user.id!, closed: false, public: true })
    const message = await createMessage({ title: "User's new Message", content: "new Message", authorId: user.id!, channelId: channel.id! })

    const request = supertest(app)
    const response = await jwtSuperTest(app).delete(`/message/${message.id}`)

    const mes = response.body;

    expect(response.statusCode).toBe(200);
    expect(mes.title).toBe(undefined);
})

test("message DELETE !author", async () => {
    let user: UserResource
    let channel: ChannelResource

    user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })
    await prepareJWTAccessToken("user@example.de", "password1")

    channel = await createChannel({ name: "User's Channel", description: "Try first", ownerId: user.id!, closed: false, public: true })
    const message = await createMessage({ title: "User's new Message", content: "new Message", authorId: user1.id!, channelId: channel.id! })

    const response = await jwtSuperTest(app).delete(`/message/${message.id}`)

    const mes = response.body;

    expect(response.statusCode).toBe(401);
    expect(mes.title).toBe(undefined);
})


test("message GET and DELETE", async () => {
    let leo: UserResource
    let channel: ChannelResource
    leo = await createUser({ name: "Leo", email: "leo@double.ge", password: "leoleoleo", admin: true })
    await prepareJWTAccessToken("leo@double.ge", "leoleoleo")

    channel = await createChannel({ name: "Leo's Channel", description: "Bla Bla", ownerId: leo.id!, closed: false, public: true })
    const message = await createMessage({ title: "Leo's new Message", content: "new Content", authorId: user1.id!, channelId: channel.id! })

    const response = await jwtSuperTest(app).put(`/message/${message.id}`)

    expect(response.statusCode).toBe(400);

});

test("NON_EXISTING_MESSAGE delete", async () => {
    const response = await jwtSuperTest(app).delete(`/message/${NON_EXISTING_ID}`);

    expect(response.statusCode).toBe(404);
});

test("NON_EXISTING_MONGOID delete", async () => {
    const response = await jwtSuperTest(app).delete(`/message/${NON_MONGO_ID}`);

    expect(response.statusCode).toBe(400);
});










