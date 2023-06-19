import { Channel } from "../../src/model/ChannelModel";
import { Message } from "../../src/model/MessageModel";
import { User } from "../../src/model/UserModel";
import { MessageResource } from "../../src/services/ChannelResources";
import { createMessage, updateMessage } from "../../src/services/EditMessagesService";
import { getMessages, MessagesResource } from "../../src/services/ManageChannelsServiceGetMessages";
import { dateToString } from "../../src/services/ServiceHelper";
import DB from "../DB";

let idMsgJohn: string
let idJohn: string
let idChannelJohn: string
let dateStrMessageJohn: string

beforeAll(async () => await DB.connect())
beforeEach(async () => {
    const john = await User.create({
        email: "john@doe.de",
        name: "John",
        password: "1234",
        admin: false
    })
    idJohn = john.id;
    const c1 = await Channel.create({
        name: "John's Channel",
        description: "This is John's channel.",
        owner: idJohn
    })
    idChannelJohn = c1.id;
    const msg = await Message.create({
        title: "John's Message",
        content: "This is John's content.",
        author: idJohn,
        channel: idChannelJohn
    });
    idMsgJohn = msg.id;
    dateStrMessageJohn = dateToString(msg.createdAt);
})
afterEach(async () => {
    await DB.clear();
})
afterAll(async () => await DB.close())




test("getMessages funktioniert grundsätzlich", async () => {

    const msg2 = await Message.create({
        title: "John's 2nd Message",
        content: "This is John's content, too.",
        author: idJohn,
        channel: idChannelJohn
    });


    const messages = await getMessages(idChannelJohn)
    expect(messages).toEqual({
        messages: [
            {
                id: idMsgJohn,
                title: "John's Message",
                content: "This is John's content.",
                authorId: idJohn,
                author: "John",
                channelId: idChannelJohn,
                createdAt: dateStrMessageJohn
            },
            {
                id: msg2.id,
                title: "John's 2nd Message",
                content: "This is John's content, too.",
                authorId: idJohn,
                author: "John",
                channelId: idChannelJohn,
                createdAt: dateToString(msg2.createdAt)
            }
        ]
    })

})

