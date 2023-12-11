import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageDto, userDataDto } from './DTOs/dto';
import { ConnectedSocketInfo } from './types/connected_socket_info';
import { MessageInfo } from './types/message';
// import { PrismaChatService } from 'chatapp/server_chatapp/prisma/chat/prisma.chat.service';
// import { TmpUserService } from 'chatapp/server_chatapp/prisma/tmpUserAdd.service';
import { GatewayService } from './chat.gateway.service';
import { PrismaChatService } from '../prisma/chat/prisma.chat.service';



@WebSocketGateway({cors : {origin : '*'}})
export class ChatGateway implements OnModuleInit{

  constructor(private readonly prismaChat:PrismaChatService, private readonly gatewayService:GatewayService) {}

  // socketHoler: Socket;

  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('a socket has connected, Id: ', socket.id);
    })
  }

  @SubscribeMessage('userData')
  subscribeUserData(client: Socket, data: userDataDto) {
    console.log(data);
    const connectedSocket = this.gatewayService.addConnectedSocket({socket:client, userId:data.userId});
    // this.connectedSockets.add({socket: client, userId: data.userId})

    this.gatewayService.joinRooms(connectedSocket);
  }

  @SubscribeMessage('messageTo')
  async sendMessageTo(client: Socket, msg: messageDto) {

    // client.emit('privateMessage', msg.message, msg.conversationId);
    client.broadcast.to(msg.conversationId).emit("privateMessage", msg.message);
    // check if there is aconversation between the two users
    // if not create a new conversation
    // next add messages to database 

    // const requestedSocket = this.getRequestedSocket(msg.);

    await this.prismaChat.addMessageToDM(msg);
    // console.log("sending message to", msg.messageTo);
    // requestedSocket.emit('onMessage', msg.message);
  }



}
