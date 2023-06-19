import { User } from "../model/UserModel"
import { Types } from "mongoose"

/**
 * Ressource "Users".
 */
export type UsersResource = {
    users: UserResource[]
}

/**
 * Ressource "User".
 */
export type UserResource = {
    id?: string
    name: string
    email: string
    admin: boolean
    /**
     * Wird vom Service nur gelesen aber niemals zurückgegeben.
     */
    password?: string
}

/**
 * Die Passwörter dürfen nicht zurückgegeben werden.
 */

"FRAGE"
export async function getUsers(): Promise<UsersResource> {
    const users = await User.find();
    if (!users) {
        throw new Error("not found")
    }
    return {
        users: users.map(user => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin
            }
        })
    }
}
// export async function getUser(userID: string): Promise<UserResource> {
//     const user = await User.findById(userID).exec();
//     if (!user) {
//         throw new Error("not found")
//     }
//     return {
//         id: user.id.toString(),
//         name: user.name,
//         email: user.email,
//         admin: user.admin

//     }

// }


/**
 * Erzeugt einen User. Die E-Mail-Adresse wird in Kleinbuchstaben umgewandelt.
 * Das Password darf nicht zurückgegeben werden.
 */
export async function createUser(userResource: UserResource): Promise<UserResource> {
    const newUser = await User.create({ name: userResource.name, email: userResource.email, password: userResource.password, admin: userResource.admin });

    const savedUser = await newUser.save();
    return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email.toLowerCase(),
        admin: savedUser.admin
    }
}


/**
 * Updated einen User. Die E-Mail-Adresse, falls angegeben, wird in Kleinbuchstaben umgewandelt.
 * Beim Update wird der User über die ID identifiziert.
 * Der Admin kann einfach so ein neues Passwort setzen, ohne das alte zu kennen.
 */
export async function updateUser(userResource: UserResource): Promise<UserResource> {
    const user = await User.findById(userResource.id).exec();
    if (!user) {
        throw new Error("User not found")
    }

    if (userResource.password) {
        if (userResource.admin = true && userResource.password != null) {
            user.password = userResource.password;
        }
    }

    user.name = userResource.name;
    user.email = userResource.email.toLowerCase();
    const savedUser = await user.save();
    return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        admin: savedUser.admin
    }
}

/**
 * Beim Löschen wird der User über die ID identifiziert. Falls Benutzer nicht gefunden wurde (oder aus
 * anderen Gründen nicht gelöscht werden kann) wird ein Fehler geworfen.
 */
export async function deleteUser(id: string): Promise<void> {
    const user = await User.findById(id).exec();
    if (!user) {
        throw new Error('User not found')
    }

    const res = await User.deleteOne({ _id: new Types.ObjectId(id) });
    if (!res) {
        throw new Error(`User with ${id} can not find and delete`)
    }
}
