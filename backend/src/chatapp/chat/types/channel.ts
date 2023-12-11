import { user } from "./user";

export type ChannelData = {
    channelName: string;
    password?: string;
    type: string;
    admines?: string[];
    creator: string;
    members?: user[];
}

export type ChangeChannelData = {
    channelName: string;
    password?: string;
    type: string;
    channelId: string;
    userId: string
    removeAdmins?: user[];
    addAdmins?: user[];
}

export type JoinChannel = {
    channelId: string,
    password?: string,
    userId:string,
}

// export type DeleteChannel = {
//     channelId:string,
//     userId:string,
// }

// export type RemoveUserFromChannel = {
//     channelId:string,
//     userId:string,
//     userToRemove?:string

// }

export type ChannelEdit = {
    channelId:string,
    userId:string,
    userId2?:string,
}