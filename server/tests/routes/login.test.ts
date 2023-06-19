import supertest from "supertest";
import app from "../../src/app"
import { IUser } from "../../src/model/UserModel";
import { login } from "../../src/routes/login";
import { createUser, deleteUser, UserResource } from "../../src/services/AdministerUsersService";
import { verifyPasswordAndCreateJWT } from "../../src/services/AuthenticationService";
import DB from "../DB";
import { jwtSuperTest, prepareJWTAccessToken } from "./JWTPreparedSuperTest";

const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
const NON_EXISTING_MONGOID = "635";
let john: UserResource
beforeAll(async () => { await DB.connect(); })
beforeEach(async () => {
    john = await createUser({
        name: "John",
        email: "john@doe.ge",
        password: "abcdefg",
        admin: false
    })
    await prepareJWTAccessToken("john@doe.ge", "abcdefg")
})
afterEach(async () => { await DB.clear(); })
afterAll(async () => {
    await DB.close()
})



test("user PUT !admin", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    await prepareJWTAccessToken("userexample@example.de", "abcdefg")

    const response = await jwtSuperTest(app).post(`/login`).send(user)

    expect(response.statusCode).toBe(400);

})

test("user GET", async () => {
    const request = supertest(app);
    const response = await request.get(`/login`);
    expect(response.status).toBe(200);
})

test("user GET", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    const s = await verifyPasswordAndCreateJWT("userexample@example.de", "abcdefg")
    const response = await jwtSuperTest(app).post(`/login`).send(s);

    expect(response.status).toBe(400);
})

test("user LOGIN true", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    const s = await login("userexample@example.de", "abcdefg")
    expect(s.name).toEqual(user.name)

})

test("user Login false", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    const s = await login("userexample@example.de", "abcdefgf")
    expect(s.name).not.toEqual(user.name)
})

test("user Login false", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    const s = await login("USER@DOE", "abcdefgf")
    expect(s.name).not.toEqual(user.name)
})









