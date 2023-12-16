import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';
import { User } from '@prisma/client';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';


@WebSocketGateway({namespace: 'api/matchmaking', cors : {origin : '*'}, transports: ['websocket']})
export class MatchmakingGateway implements  OnGatewayConnection, OnGatewayDisconnect{
    constructor(private gameService: GameService, private readonly jwtService: JwtService,
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
            client.on('CancelQueue', () => {
                this.gameService.removeFromQueue(client);
                client.disconnect(true);
                return ;
            });
            this.gameService.clearFinishedGames();
            if (this.gameService.inGameCheck(client))
            {
                client.emit('CancelQueue')
                client.disconnect(true);
                return ;
            }
            this.gameService.MatchMaking(this.server, client);
        }
        catch (error) {
            client.emit('redirect', '/', 'You are not logged in');
            client.disconnect(true);
            return ;
        }
    }
    handleDisconnect(client: Socket) {
        this.gameService.removeFromQueue(client) // remove from queue if in queues
        console.log("user disconnected: ", (client['user'] ? client['user'].username : client.id));
    }
    }