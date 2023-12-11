export type User = {
    id: string;
    creatorOf?: string[];
    admineOf?: string[];
    friends?: string[];
    blockedUsers?: string[];
    profilePic: string;
    username: string;
    title: string;
}

export type UserDtetails = {
    email : string;
    username: string;
    profilePic: String;

};