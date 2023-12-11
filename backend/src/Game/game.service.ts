import { Global, Injectable } from '@nestjs/common';
import { GameInstance } from './game.instance';
import { Server, Socket} from 'socket.io';

type FriendRoom = [string, Socket[]]

@Global()
@Injectable()
export class GameService {
    private gameList: Array<GameInstance> = [];
    private gameRoomList: Array<string> = [];
    private friendRooms: Array<FriendRoom> = [];
    private matchPlayers: Array<Socket> = [];
    private roomNumber: number = 0;
    constructor() {}
    // handle the friend request game
    friendGameEvent(io : Server , playerSocket: Socket, froomID : string) {
        var isAlreadyFriendRoom = false;
        for (var i = 0; i < this.friendRooms.length; i++)
        {
            if (this.friendRooms[i][0] == froomID)
            {
                if (this.friendRooms[i][1].length == 2)
                {
                    playerSocket.emit('redirect', '/', 'You are not allowed to join this room');
                    playerSocket.disconnect(true);
                    return ;
                }
                this.friendRooms[i][1].push(playerSocket);
                isAlreadyFriendRoom = true;
                console.log('Added player to friend room');
                if (this.friendRooms[i][1].length == 2)
                {
                    console.log('Friendly Game is starting...');
                    var newGame = new GameInstance(this.friendRooms[i][1][0], this.friendRooms[i][1][1],
                        this.friendRooms[i][0], io);
                    console.log('Game Created between ' + this.friendRooms[i][1][0].id +
                     ' and ' + this.friendRooms[i][1][1].id);
                    newGame.startFriendGame();
                    this.gameList.push(newGame);
                    this.gameRoomList.push(this.friendRooms[i][0]);
                }
                break;
            }
        }
        if (!isAlreadyFriendRoom)
        {
            var friendRoom : FriendRoom = [froomID, [playerSocket]];
            this.friendRooms.push(friendRoom);
            console.log('Created friend room');
        }
    }


    startGameEvent(io : Server ,playerSocket: Socket) {
        console.log('A client started game event...');
        playerSocket.emit('updateGameList', this.gameRoomList);
        playerSocket.on('spectateGame', (roomNumber: string) => {
            for (var i = 0; i < this.gameList.length; i++)
            {
                if (this.gameList[i].gameInfo.gameRoom == roomNumber)
                {
                    this.gameList[i].addSpectator(playerSocket);
                    console.log('spectator added');
                }
            }
        });
        playerSocket.on('requestJoinGame', () => {
            console.log('A client is trying to find the game');
            if (this.matchPlayers.length < 2)
            {
                this.matchPlayers.push(playerSocket);
                console.log(playerSocket["user"].username + ' is trying to find the game');
            }
            if (this.matchPlayers.length == 2)
            {
                console.log('Game is starting...');
                var newGame = new GameInstance(this.matchPlayers[0], this.matchPlayers[1], this.roomNumber.toString(), io);
                console.log('Game Created between ' + this.matchPlayers[0].id + ' and ' + this.matchPlayers[1].id);
                newGame.startGame();
                this.gameList.push(newGame);
                this.gameRoomList.push(this.roomNumber.toString());
                io.emit('updateGameList', this.gameRoomList);
                console.log('Game Started');
                this.matchPlayers = [];
                this.roomNumber++;
            }
        });
    }


} 
