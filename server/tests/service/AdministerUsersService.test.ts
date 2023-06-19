

import { User } from "../../src/model/UserModel";
import { createUser, deleteUser, getUsers, updateUser, UserResource } from "../../src/services/AdministerUsersService";

import DB from "../DB";




let idJohn: string

beforeAll(async () => await DB.connect())
beforeEach(async () => {
    const john = await createUser({

        email: "john@doe.de",
        name: "John",
        password: "1234",
        admin: false
    })
    idJohn: john.id

})
afterEach(async () => await DB.clear())

afterAll(async () => await DB.close())



test("create User2", async () => {
    const prefs = await createUser({ name: "john", email: "johnboy@gmail.com", admin: false, password: "123456" });
    expect(prefs.name).toBe("john");
    expect(prefs.email).toBe("johnboy@gmail.com");
    expect(prefs.admin).toBe(false);
});

test("create User3", async () => {
    let user: UserResource
    user = await createUser({ name: "Giorgi", email: "javakhishvili@gmail.com", admin: false, password: "javakhishvili12" });
    expect(user.name).toBe("Giorgi");
    expect(user.email).toBe("javakhishvili@gmail.com");
    expect(user.admin).toBe(false);
    const deletedUser = await deleteUser(user.id!)
    expect(deletedUser).toBeUndefined()


});



test("update User", async () => {

    const jane = await createUser({
        email: "Janedoe@example.com",
        name: "Jane",
        password: "1234",
        admin: false
    })
    jane.name = "Janne"
    const get = await updateUser(jane)
    expect(get.name).toBe("Janne")
})

const userPayload = {
    name: "Jane",
    email: "jane@example.com",
    admin: true,
    password: "aPassword123",
}


test("should create a new user", async () => {
    const user = await createUser(userPayload);
    expect(await user.password)
    expect(user.name).toBe(userPayload.name);
    expect(user.email).toBe(userPayload.email);
    expect(user.email).toBe(userPayload.email);
});


test('Subscription Tests', async () => {
    const users = {
        admin: {
            id: 'admin',
            name: 'Administrator',
            admin: true,
            email: 'admin@example.com'
        },
        userA: {
            id: 'userA',
            name: 'User A',
            admin: false,
            email: 'userA@example.com'
        },
        userB: {
            id: 'userB',
            name: 'User B',
            admin: false,
            email: 'userB@example.com'
        }
    }

    const getusers = await getUsers()

    expect(getusers).toBeDefined()

})


test("update password", async () => {
    const userA = await createUser({
        name: 'User A',
        admin: true,
        email: 'userA@example.com',
        password: 'user12345'
    });

    userA.password = "userA";
    const newPassword = await updateUser(userA)
    if (newPassword) {
        expect(userA.password).toBeDefined();
        expect(userA.password).toEqual("userA")
        //expect(await userA.isCorrectPassword("userA")).toBeTruthy();
    }

});

