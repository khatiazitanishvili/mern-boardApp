// Vgl. Folie 126 (SuperTest)

import supertest from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/UserModel";
import { createJohnsBoard } from "../../src/prefill";
import { createUser, UserResource } from "../../src/services/AdministerUsersService";
import DB from "../DB";
import "jest-extended"
import { jwtSuperTest, prepareJWTAccessToken } from "./JWTPreparedSuperTest";
import { getBoard } from "../../src/services/ViewBoardService";
import { ChannelResource } from "../../src/services/ChannelResources";
import { createChannel } from "../../src/services/ManageChannelsService";
import { createMessage } from "../../src/services/EditMessagesService";

let john: UserResource

beforeAll(async () => {
    await DB.connect();
})
beforeEach(async () => {
    User.syncIndexes()
    // create a user and some channels with messages
    john = await createUser({ name: "John", email: "john@some-host.de", password: "123", admin: true })
    await prepareJWTAccessToken("john@some-host.de", "123")
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})

test("board GET, Positivtest ohne Anmeldung", async () => {
    // setup a nice board
    const expectedBoard = await createJohnsBoard(john.id!)
    expectedBoard.channels =
        expectedBoard.channels.filter(channel => channel.public);

    // get that nice board
    const request = supertest(app);
    const response = await request.get(`/board`);
    expect(response.statusCode).toBe(200);

    const boardRes = response.body;
    expect(boardRes).toEqual(expectedBoard);
});

test("board GET, Positivtest mit Anmeldung", async () => {
    // setup a nice board
    const expectedBoard = await createJohnsBoard(john.id!)

    // get that nice board
    const response = await jwtSuperTest(app).get(`/board`); // jwtSuperTest simuliert die erfolgreiche Anmeldung
    expect(response.statusCode).toBe(200);

    const boardRes = response.body;
    expect(boardRes.channels).toIncludeSameMembers(expectedBoard.channels);
});




