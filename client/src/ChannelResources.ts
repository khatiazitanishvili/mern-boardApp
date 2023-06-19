/* istanbul ignore file */
/**
 * Ressource "Board".
 */
export type BoardResource = {
    channels: ChannelResource[]
}

/**
 * Ressource "Channel", die optionalen Properties werden nur vom Service gesetzt.
 */
export type ChannelResource = {
    id?: string
    name: string
    description: string
    /**
     * Name des Owners, also der Name des Users mit der ID ownerID
     */
    owner?: string
    ownerId: string
    /**
     * Im Format DD.MM.YYYY ohne führende Nullen, also etwa 1.12.2022
     */
    createdAt?: string
    messageCount?: number
    public: boolean
    closed: boolean
}

/**
 * Ressource "Message", die optionalen Properties werden nur vom Service gesetzt.
 */
export type MessageResource = {
    id?: string
    title: string
    /**
     * Name des Autors, also der Name des Users mit der ID ownerID
     */
    author?: string
    authorId: string
    /**
     * Im Format DD.MM.YYYY ohne führende Nullen, also etwa 1.12.2022
     */
    createdAt?: string
    content: string
    channelId: string
}

export type MessagesResource = {
    messages: MessageResource[];
}




export type ValidationMessages<Type> = {
    [Property in keyof Type]?: string;
}
