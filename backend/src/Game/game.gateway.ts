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
        this.gameService.clearFinishedGames();
        const inGame = this.gameService.inGameCheck(client);
        if (inGame)
          return ;
        const matchID = client.handshake.auth.matchID;
        if (matchID)
          this.gameService.GameEvent(this.server, client,matchID);
        else
        {
          client.emit('redirect', '/', 'You are not allowed to join this room');
          client.disconnect(true);
          return ;
        }
      }
      catch (error) {
        client.emit('redirect', '/', 'You are not logged in');
        client.disconnect(true);
        return ;
      }
  }
  handleDisconnect(client: Socket) {
    if (client['user'] != undefined)
      this.gameService.stopGameEvent(client)
    console.log("user disconnected: ", (client['user'] ? client['user'].username : client.id));
  }
}
