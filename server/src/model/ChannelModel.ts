import { Schema, model } from "mongoose"

export interface IChannel {
    owner: Schema.Types.ObjectId,
    members: Schema.Types.ObjectId,
    name: string,
    description: string,
    public: boolean,
    createdAt: Date,
    closed: boolean
}



const channelSchema = new Schema<IChannel>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [Schema.Types.ObjectId], ref: "User]", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    public: { type: Boolean, default: false },
    closed: { type: Boolean, default: false }
}, { timestamps: true });






export const Channel = model('Channel', channelSchema);



