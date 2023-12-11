import { Injectable } from "@nestjs/common";
import { ConnectedSocketInfo } from "./types/connected_socket_info";
import { Socket } from 'socket.io';
// import { TmpUserService } from "chatapp/server_chatapp/prisma/tmpUserAdd.service";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { member } from "./types/user";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";
import { TmpUserService } from "../prisma/tmpUserAdd.service";

@Injectable()
export class GatewayService{
    constructor(private readonly prismaChat:PrismaChatService, private readonly tmpUserAddService:TmpUserService, ){}
    connectedSockets = new Set<ConnectedSocketInfo>();

    addConnectedSocket(connectedSocket:ConnectedSocketInfo){
        this.connectedSockets.add(connectedSocket);
        return(connectedSocket);
    }

    async joinRooms(connectedSocket:ConnectedSocketInfo){
        // const memberIn = await this.prismaChat.getMemberIn(connectedSocket.userId);
        const conversations = await this.prismaChat.getUserConversations(connectedSocket.userId);

        conversations.forEach((conversation)=>{
                const connectedMembers = this.getConnectedMembers(conversation.members);

                // later you can add a check if the socket is already in a room
                if (connectedMembers.length >= 2){
                    connectedMembers.forEach((connectedMember)=>{
                        console.log("connectedMember:", connectedMember.userId);
                        const sockets = this.getRequestedSockets(connectedMember.userId);
                        sockets.forEach((socket)=>{
                            console.log("the socketId: ", socket.id, " has connected conv");
                            socket.join(conversation.id);
                        })
                    });
                }
            // }

            // handle disconnect
        });
        // })
    }

    private getConnectedMembers(members:member[]){
        const connnectedMembers = members.filter((member)=>{
            if (this.isConnected(member.userId))
                return true
        })
        return connnectedMembers;
    }

    private getFriend(members:member[], userId:string){
        for(const member of members)
        {
            if (member.userId != userId)
                return (member.userId);
        }
    }

    private isConnected(userId:string):boolean{
        if (this.getRequestedSocket(userId)) return true

        return false
    }

    private getRequestedSocket(userId: string) {
        for (const element of this.connectedSockets) {
            if (element.userId === userId) {
                return element.socket;
            }
        }
        return null;
    }

    private getRequestedSockets(userId: string): Socket[] {
    let matchedSockets: Socket[] = [];
        for (const element of this.connectedSockets) {
        if (element.userId === userId) {
            matchedSockets.push(element.socket);
            }
        }
        return matchedSockets;
    }
}