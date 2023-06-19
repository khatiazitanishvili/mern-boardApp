import { Schema, model, Types } from "mongoose"


export interface IMessage {
    author: Schema.Types.ObjectId,
    channel: Schema.Types.ObjectId,
    title: string,
    content: string,
    createdAt: Date
}


const messageSchema = new Schema<IMessage>({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });


export const Message = model('Message', messageSchema);








