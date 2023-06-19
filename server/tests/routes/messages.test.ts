import supertest from "supertest";
import app from "../../src/app";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import { createMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";
import { MessagesResource } from "../../src/services/ManageChannelsServiceGetMessages";
import DB from "../DB";

let john: UserResource
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";

beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    john = await createUser({ name: "John", email: "john@doe.de", password: "123", admin: false })
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

test("messages GET, Positivtest", async () => {
    // setup a channel with some messages
    const expectedMessages: MessagesResource = { messages: [] }
    const channel = await createChannel({ name: "John's channel", description: "none", public: true, ownerId: john.id!, closed: false })
    for (let m = 0; m < 5; m++) {
        const message = await createMessage({ title: "Message " + m, content: "no content for message " + m, authorId: john.id!, channelId: channel.id! })
        expectedMessages.messages.push(message);
    }

    // get these messages
    const request = supertest(app);
    const response = await request.get(`/channel/${channel.id}/messages`);
    expect(response.statusCode).toBe(200);

    const messagesRes = response.body;
    expect(messagesRes).toEqual(expectedMessages);
});

test("messages GET, nicht existierende Channel-ID", async () => {
    // ein Channel und Message, um theoretisch etwas liefern zu können
    const expectedMessages: MessagesResource = { messages: [] }
    const channel = await createChannel({ name: "John's channel", description: "none", public: true, ownerId: john.id!, closed: false })
    const message = await createMessage({ title: "Message 1", content: "no content for message", authorId: john.id!, channelId: channel.id! })

    // get these messages
    const request = supertest(app);
    const response = await request.get(`/channel/${NON_EXISTING_ID}/messages`);
    expect(response.statusCode).toBe(404);
});
