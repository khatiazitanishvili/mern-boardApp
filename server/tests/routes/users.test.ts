import supertest from "supertest";
import app from "../../src/app";
import { createUser, UserResource, UsersResource } from "../../src/services/AdministerUsersService";
import { createMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";
import { MessagesResource } from "../../src/services/ManageChannelsServiceGetMessages";
import DB from "../DB";

//let john: UserResource
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";

beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    //  john = await createUser({ name: "John", email: "john@doe.de", password: "123", admin: false })
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

test("users GET, Positivtest", async () => {
    // setup a channel with some messages
    const expectedUSers: UsersResource = { users: [] }
    for (let m = 0; m < 5; m++) {
        const user = await createUser({ name: "Jane " + m, email: "jane@gmail.com" + m, password: "1password", admin: true })
        expectedUSers.users.push(user);
    }

    // get these messages
    const request = supertest(app);
    const response = await (await request.get(`/users`));
    expect(response.statusCode).toBe(200);

    const messagesRes = response.body;
});

test("users GET, nicht existierende Channel-ID", async () => {
    // ein Channel und Message, um theoretisch etwas liefern zu können

    const expectedUSers = ""
    const user = await createUser({ name: "Diana", email: "none@gmail.com", password: "true111", admin: false })

    // get these messages
    const request = supertest(app);
    const response = await request.get(`/users`);
    expect(response.statusCode).toBe(200);
});



