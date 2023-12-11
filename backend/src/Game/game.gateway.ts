import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Inject, Req, UnauthorizedException } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';
import { GameInstance } from './game.instance';
import { User } from '@prisma/client';

@WebSocketGateway({namespace: 'api/game', cors : {origin : '*'}, transports: ['websocket']})
export class GameGateway implements  OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly gameService: GameService,private readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService)  {}
   @WebSocketServer()
  server: Server;
  async handleConnection(client: any, ...args: any[]) {
      try
      {
        const token = client.handshake.auth.token;
        const payload = await this.jwtService.verifyAsync(token, {
            secret : process.env.jwtSecretKey,
        });
        const user = await this.authGoogleService.findUserByEmail(payload.email);
        client["user"] = user as User;
        console.log("INFORMATIONS RECEIVED FROM = " , user.username);
      }
      catch (error) {
        console.log("This client has no token: " , client.id);
        client.emit('redirect', '/', 'You are not logged in');
        client.disconnect(true);
        return ;
      }
      const matchID = client.handshake.auth.matchID;
      if (matchID)
        this.gameService.friendGameEvent(this.server,client,matchID);
      else
        this.gameService.startGameEvent(this.server,client);
  }
  handleDisconnect(client: Socket) {
    console.log("user disconnected: ", client.id);
  }
}

