export type messageType = {
    id:number;
    message:string;
    timeSent:string;
    senderId:number; /* should be remove if the user is already known */
}

export type userInfo = {
    id:number;
    imageUrl:string;
    userName:string;
    title:string;
    status:number;
    userMessages:messageType[];
    lastMessage:string; /*temp value*/
}