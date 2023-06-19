import supertest from "supertest";
import app from "../../src/app"
import { IUser } from "../../src/model/UserModel";
import { createUser, deleteUser, UserResource } from "../../src/services/AdministerUsersService";
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


// EXERCISE get
test("user GET", async () => {
    const request = supertest(app);
    const response = await request.get(`/user/${NON_EXISTING_ID}`);
    expect(response.status).toBe(200);
})

test("NON EXISTING USER get validator", async () => {
    const request = supertest(app);
    const response = await request.get(`/user/${NON_EXISTING_MONGOID}`);
    expect(response.statusCode).toBe(400);
});

test("NON EXISTING USER get", async () => {
    const NON_EXISTING = "635d2e796ea2e8c9bde5787c";


    const response = await jwtSuperTest(app).delete(`/user/${NON_EXISTING}`);
    const response1 = await jwtSuperTest(app).get(`/user/${NON_EXISTING}`);


    expect(response.statusCode).toBe(404);
    expect(response1.statusCode).toBe(200);

});


// EXERCISE post
test("user POST", async () => {
    let NON_USER: UserResource
    const user = await createUser({ name: "Laura", email: "laura@doedoe.de", password: "abcdefge", admin: true })
    await prepareJWTAccessToken("laura@doedoe.de", "abcdefge")
    const response = await jwtSuperTest(app).post(`/user`).send(user)
    expect(response.status).toBe(404);

})

test("user POST", async () => {
    const user = await createUser({ name: "Laura", email: "laura@doedoe.de", password: "abcdefge", admin: false })
    await prepareJWTAccessToken("laura@doedoe.de", "abcdefge")
    const response = await jwtSuperTest(app).post(`/user`).send(user)
    expect(response.status).toBe(404);

})

test("NON EXISTING USER post", async () => {
    const NON_EXISTING_USER = "kleo";

    const response = await jwtSuperTest(app).post(`/user`).send(NON_EXISTING_USER);

    expect(response.statusCode).toBe(400);
});

test("user POST", async () => {
    const user = await createUser({ name: "Laura", email: "laura@doedoe.de", password: "abcdefge", admin: true })
    const response = await jwtSuperTest(app).post(`/user`).send(user)
    expect(response.status).toBe(404);
})



// EXERCISE put
test("user PUT", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: true })

    const updatedUser: UserResource = ({
        id: user.id,
        name: "User",
        email: "janeexample@doe.de",
        password: "abcdefg",
        admin: true
    })


    const response = await jwtSuperTest(app).put(`/user/${user.id}`).send(updatedUser)

    const newUser = response.body;

    expect(response.statusCode).toBe(200);
    expect(newUser.admin).toBe(true);
    expect(newUser.name).toEqual(user.name);

})

test("user PUT !admin", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })

    const updatedUser: UserResource = ({
        id: user.id,
        name: "User",
        email: "janeexample@doe.de",
        password: "abcdefg",
        admin: true
    })


    const response = await jwtSuperTest(app).put(`/user/${user.id}`).send(updatedUser)

    const newUser = response.body;

    expect(response.statusCode).toBe(401);

})



test("NON EXISTING USER put", async () => {
    const response = await jwtSuperTest(app).put(`/user/${NON_EXISTING_ID}`);
    expect(response.statusCode).toBe(400);
});

test("NON EXISTING USER put", async () => {
    const response = await jwtSuperTest(app).put(`/user/${NON_EXISTING_MONGOID}`);
    expect(response.statusCode).toBe(400);
});


// EXERCISE delete
test("user DELETE", async () => {
    // const user = await createUser({ name: "user", email: "user@example.de", password: "password1", admin: true })

    const response = await jwtSuperTest(app).delete(`/user/${john.id!}`);

    const mes = response.body;

    expect(response.statusCode).toBe(401);
    expect(mes.name).toBe(undefined);
})

test("NON EXISTING USER delete", async () => {

    const response = await jwtSuperTest(app).delete(`/user/${NON_EXISTING_ID}`);
    expect(response.statusCode).toBe(404);
});

test("NON MONGO ID USER delete", async () => {
    const response = await jwtSuperTest(app).delete(`/user/${NON_EXISTING_MONGOID}`);
    expect(response.statusCode).toBe(400);
});

test("user DELETE !admin", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: false })
    const response = await jwtSuperTest(app).delete(`/user/${user.id}`);
    expect(response.statusCode).toBe(401);
});

test("user DELETE admin", async () => {
    const user = await createUser({ name: "User", email: "userexample@example.de", password: "abcdefg", admin: true })
    await prepareJWTAccessToken("userexample@example.de", "abcdefg")
    const response = await jwtSuperTest(app).delete(`/user/${user.id}`);
    expect(response.statusCode).toBe(200);
});

