export type user = {
    userId: string,
    isAdmin: Boolean,
}

export type member = {
    id: number;
    conversationId: string;
    userId: string;
}

export type StratDMDto = {
    userId:string;
    userId2:string;
}