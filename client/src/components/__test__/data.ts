import { BoardResource, MessageResource } from "../../ChannelResources"

export const demoBoard: BoardResource = {
	channels:[
		{
			id: "123456",
			name: "Channel 1",
            description: "Description 1",
            owner: "Owner 1",
            ownerId: "2",
            createdAt: "01.10.2021",
            messageCount: 5,
            public: true,
            closed: false
		},
		{
			id: "987654",
			name: "Channel 2",
            description: "Description 2",
            owner: "Owner 2",
            ownerId: "2",
            createdAt: "01.11.2021",
            messageCount: 3,
            public: true,
            closed: false
		}
	]
};

export const demoMessagesChannel1: MessageResource[] = [
    {
        id: "51",
        title: "Message 1",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "01.1.2022",
        content: "Content 1",
    },
    {
        id: "52",
        title: "Message 2",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "02.1.2022",
        content: "Content 2",
    },
    {
        id: "53",
        title: "Message 3",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "03.1.2022",
        content: "Content 3",
    },
    {
        id: "54",
        title: "Message 4",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "04.1.2022",
        content: "Content 4",
    },
    {
        id: "55",
        title: "Message 5",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "05.1.2022",
        content: "Content 5",
    },
    
];

export const demoMessagesChannel2: MessageResource[] = [
    {
        id: "71",
        title: "Message 1",
        authorId: "123456",
        author: "Author 1",
        channelId: "987654",
        createdAt: "01.2.2021",
        content: "Content 1",
    },
    {
        id: "72",
        title: "Message 2",
        authorId: "123456",
        author: "Author 1",
        channelId: "987654",
        createdAt: "02.2.2021",
        content: "Content 2",
    },
    {
        id: "73",
        title: "Message 3",
        authorId: "123456",
        author: "Author 1",
        channelId: "123456",
        createdAt: "03.2.2021",
        content: "Content 3",
    }
    
];