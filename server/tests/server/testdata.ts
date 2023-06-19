import { createUser } from "../../src/services/AdministerUsersService"
import { BoardResource } from "../../src/services/ChannelResources"
import { createMessage } from "../../src/services/EditMessagesService"
import { createChannel } from "../../src/services/ManageChannelsService"

/**
 * Creates a board for the given (or newly created) user
 * @param john Is if the user owning channels and author of the messages, if omitted, it is created
 * @return the board resource (which has actually been created in the database)
 */
export async function createJohnsBoard(johnsID?: string): Promise<BoardResource> {
    if (!johnsID) {
        const john = await createUser({ name: "John", email: "john@doe.de", password: "123", admin: false })
        johnsID = john.id!;
    }
    // setup a nice board
    const board: BoardResource = { channels: []}
    const messagesPerChannel= [1,4,2,0]
    for (let i=0; i<messagesPerChannel.length; i++) {
        const channel = await createChannel({ name: "John's channel #"+i, description: "none for " + i, public: true, ownerId: johnsID, closed: false })
        for (let m=0; m<messagesPerChannel[i]; m++) {
            await createMessage({ title: "Message " + m, content: "no content for message " + m + " in channel " + i, authorId: johnsID, channelId: channel.id! })
        }
        board.channels.push({...channel, messageCount: messagesPerChannel[i]});
     }
     return board;
}