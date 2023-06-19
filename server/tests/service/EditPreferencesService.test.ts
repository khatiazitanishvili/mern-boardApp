import { User } from "../../src/model/UserModel";

import { createUser, deleteUser, updateUser, UserResource } from "../../src/services/AdministerUsersService";

import { getPreferences, updatePreferences } from "../../src/services/EditPreferencesService";
import DB from "../DB";

/**
 * Hier definiert, damit wir Module-Scope haben. Gesetzt wird es in beforeEach
 */
let idJohn: string

beforeAll(async () => await DB.connect())
beforeEach(async () => {
    User.syncIndexes()
    const john = await User.create({
        email: "john@doe.de", name: "John",
        password: "1234", admin: false
    })
    idJohn = john.id;
})
afterEach(async () => {
    await DB.clear();
})
afterAll(async () => await DB.close())

test("getPreferences funktioniert grundsätzlich", async () => {
    const prefs = await getPreferences(idJohn);
    expect(prefs).toBeDefined()
    expect(prefs.email).toBe("john@doe.de")
    expect(prefs.name).toBe("John")
    expect(prefs.newPassword).toBeUndefined()
    expect(prefs.oldPassword).toBeUndefined()
})



test("updatePreferences setzt Name und EMail", async () => {
    const prefs = await getPreferences(idJohn);
    prefs.name = "John Boy";
    prefs.email = "johnboy@doe.de";
    const prefsUp = await updatePreferences(idJohn, prefs);
    expect(prefsUp.name).toBe("John Boy");
    expect(prefsUp.email).toBe("johnboy@doe.de")
});

test("getPreferences funktioniert grundsätzlich", async () => {
    let laura: UserResource
    laura = await createUser({
        email: "example@gmail.com", name: "Laura",
        password: "sadad", admin: false
    })
    const prefs = await getPreferences(laura.id!);
    expect(prefs).toBeDefined()
    expect(prefs.email).toBe("example@gmail.com")
    expect(prefs.name).toBe("Laura")
    expect(prefs.newPassword).toBeUndefined()
    expect(prefs.oldPassword).toBeUndefined()
    const del = await deleteUser(laura.id!)
    expect(del).toBeUndefined()

})







