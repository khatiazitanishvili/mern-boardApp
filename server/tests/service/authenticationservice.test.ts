import supertest from "supertest";
import app from "../../src/app";
import login from "../../src/routes/login";
import { createUser, UserResource, UsersResource } from "../../src/services/AdministerUsersService";
import { verifyPasswordAndCreateJWT } from "../../src/services/AuthenticationService";
import { createMessage } from "../../src/services/EditMessagesService";
import { createChannel } from "../../src/services/ManageChannelsService";
import { MessagesResource } from "../../src/services/ManageChannelsServiceGetMessages";
import DB from "../DB";
import { prepareJWTAccessToken } from "../routes/JWTPreparedSuperTest";

let john: UserResource
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";

beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    john = await createUser({ name: "John", email: "john@some-host.de", password: "123", admin: false })
    await prepareJWTAccessToken("john@some-host.de", "123")
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

test("users GET, Positivtest", async () => {
    // setup a channel with some messages
    const res = await verifyPasswordAndCreateJWT("john@some-host.de", "123")
    await expect(res).toBeDefined;
});

