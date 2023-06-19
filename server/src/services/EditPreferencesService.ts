import { User } from "../model/UserModel"

/**
 * Ressource "Preferences". Die Passwörter werden vom Service nur gelesen und niemals zurückgegeben.
 */
export type PreferencesResource = {
    name: string
    email: string
    oldPassword?: string
    newPassword?: string
}

/**
 * Gibt Name und E-Mail eines Users zurück. Es dürfen niemals Passwörter zurückgegeben werden.
 */
export async function getPreferences(userId: string): Promise<PreferencesResource> {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(`No user with id ${userId} found`);
    }
    return {
        name: user.name,
        email: user.email
    }
}

/**
 * Updated die User-Einstellungen, also Name, Email und Passwort.
 * Falls das Passwort geändert wird, muss das alte Passwort ebenfalls übergeben werden.
 * Das Passwort kann nur geändert werden, wenn das alte Passwort korrekt war.
 * Es dürfen niemals Passwörter zurückgegeben werden.
 */
export async function updatePreferences(userId: string, preferencesResource: PreferencesResource): Promise<PreferencesResource> {
    const user = await User.findById(userId).exec();
    if (!user) {
        throw new Error(`No user with id ${userId} found, cannot update`);
    }
    if (preferencesResource.newPassword) {
        if (!preferencesResource.oldPassword) {
            throw new Error(`Cannot change password for user id ${userId} without old password`);
        }
        if (! await user.isCorrectPassword(preferencesResource.oldPassword)) {
            throw new Error(`Wrong password, cannot change password for user id ${userId} found`);
        }
        user.password = preferencesResource.newPassword;
    }
    user.name = preferencesResource.name;
    user.email = preferencesResource.email;
    const savedUser = await user.save();
    return {
        name: savedUser.name,
        email: savedUser.email
    }
}

