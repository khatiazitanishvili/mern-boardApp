import { User } from "./model/UserModel";
import { createUser } from "./services/AdministerUsersService";
import { BoardResource } from "./services/ChannelResources";
import { createMessage } from "./services/EditMessagesService";
import { createChannel } from "./services/ManageChannelsService";

/**
 * Creates user John and some channels and messages in the database.
 * 
 * This is basically for testing, but we place it in the src folder as we want
 * to use it for manual server testing as well. This is only activated when
 * the database is set to memory (DB_CONNECTION_STRING) and
 * DB_PREFILL is true. See index.ts for details.
 */
export async function prefillDB() {
    await User.syncIndexes();
    await createJohnsBoard();
}


/**
 * Creates a board for the given (or newly created) user.
 * 
 * This is basically for testing, but we place it in the src folder as we want
 * to use it for manual server testing as well.
 * 
 * @param john Is if the user owning channels and author of the messages, if omitted, it is created
 * @return the board resource (which has actually been created in the database)
 */
export async function createJohnsBoard(johnsID?: string): Promise<BoardResource> {
    if (!johnsID) {
        const john = await createUser({ name: "John", email: "john@some-host.de", password: "1234", admin: true })
        console.log("Created user John, email john@some-host.de, pass: 1234, for testing purposes.")
        johnsID = john.id!;
    }
    const board: BoardResource = { channels: [] }
    // private:
    let messagesPerChannel = [3, 5, 7]
    for (let i = 0; i < messagesPerChannel.length; i++) {
        const channel = await createChannel({ name: "John's private channel #" + i, description: "none for " + i, public: false, ownerId: johnsID, closed: false })
        for (let m = 0; m < messagesPerChannel[i]; m++) {
            await createMessage({ title: "Private Message " + m, content: "no content for message " + m + " in channel " + i, authorId: johnsID, channelId: channel.id! })
        }
        board.channels.push({ ...channel, messageCount: messagesPerChannel[i] });
    }
    // public:
    messagesPerChannel = [1, 4, 2, 0]
    for (let i = 0; i < messagesPerChannel.length; i++) {
        const channel = await createChannel({ name: "John's channel #" + i, description: "none for " + i, public: true, ownerId: johnsID, closed: false })
        for (let m = 0; m < messagesPerChannel[i]; m++) {
            await createMessage({ title: "Message " + m, content: "no content for message " + m + " in channel " + i, authorId: johnsID, channelId: channel.id! })
        }
        board.channels.push({ ...channel, messageCount: messagesPerChannel[i] });
    }
    return board;
}
