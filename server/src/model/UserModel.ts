import mongoose, { Schema, model, Types, Model, Query } from "mongoose"
import bcrypt from "bcryptjs";

export interface IUser {
    email: string,
    name: string,
    password: string,
    admin: boolean
}

export interface IUserMethods {
    isCorrectPassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean },
});

"FRAGE"
UserSchema.pre("save", async function () {
    // let user = this as IUser;
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
});

// Compare a candidate password with the user's password
UserSchema.method("isCorrectPassword", async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);

});

UserSchema.pre("updateOne", async function () {
    if (!this.get("password")) {
        throw new Error("Password is not valid")
    }
    if (this.get("password")) {
        const update = await bcrypt.hash(this.get("password"), 10);
        this.set("password", update);
        // this.set("password", update).save();

    }
});


// UserSchema.pre<Query<any, IUser>>("updateOne", async function () {

//     const update = this.getUpdate() as { password?: string } | null;
//     this.set("password", update);
// });


export const User = model('User', UserSchema);





