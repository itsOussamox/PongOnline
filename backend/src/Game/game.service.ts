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
    private playersInQueue: Array<Socket> = [];
    private roomNumber: number = 0;
    constructor() {}
    GameEvent(io : Server , playerSocket: Socket, froomID : string) {
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
                if (this.friendRooms[i][1].length == 2)
                {
                    console.log('Friendly Game is starting...');
                    var newGame = new GameInstance(this.friendRooms[i][1][0], this.friendRooms[i][1][1],
                        this.friendRooms[i][0], io);
                    console.log('Game Created between ' + this.friendRooms[i][1][0]['user'].username +
                     ' and ' + this.friendRooms[i][1][1]['user'].username);
                    newGame.startGame();
                    this.gameList.push(newGame);
                    this.gameRoomList.push(this.friendRooms[i][0]);
                }
                break;
            }
        }
        if (isAlreadyFriendRoom == false)
        {
            var friendRoom : FriendRoom = [froomID, [playerSocket]];
            this.friendRooms.push(friendRoom);
            console.log('Created friend room');
        }
    }

    // already in game check
    inGameCheck(playerSocket: Socket): boolean {
        for (var i = 0; i < this.gameList.length; i++)
        {
            if (this.gameList[i].getPlayerOneInfo().playerData.username == playerSocket['user'].username
            || this.gameList[i].getPlayerTwoInfo().playerData.username == playerSocket['user'].username)
            {
                this.gameList[i].socketConnect(playerSocket);
                return true;
            }
        }
        return false;
    }

    // stop game event
    stopGameEvent(playerSocket: Socket): boolean{
        for (var i = 0; i < this.gameList.length; i++)
        {
            var pOne = this.gameList[i].getPlayerOneInfo();
            var pTwo = this.gameList[i].getPlayerTwoInfo();
            if (pOne.playerData.username == playerSocket['user'].username
            || pTwo.playerData.username == playerSocket['user'].username)
            {
                this.gameList[i].socketDisconnect(playerSocket);
                return true;
            }
        }
        return false;
    }
    
    // start matchmaking event
    isAlreadyInQueue(playerSocket: Socket): boolean {
        for (var i = 0; i < this.playersInQueue.length; i++)
        {
            if (this.playersInQueue[i]['user'].username == playerSocket['user'].username)
                return true;
        }
        return false;
    }

    MatchMaking(server : Server, client : Socket){
        this.clearFinishedGames();
        if (this.isAlreadyInQueue(client))
        {
            client.emit('CancelQueue')
            client.disconnect(true);
            return ;
        }
        this.playersInQueue.push(client);
        console.log('Player ' + client['user'].username + ' is in queue');
        if (this.playersInQueue.length == 2)
        {
            console.log('Game is starting...');
            // redirect the players to the /game/match?id=AUniqueID
            const matchID : string = this.playersInQueue[0]['user'].username + 
            this.playersInQueue[1]['user'].username + Math.random().toString();
            console.log('Match ID : ' + matchID);
            // redirect the players to the /game/match?matchID=
            this.playersInQueue[0].emit('redirect', '/game/match?matchID=' + matchID);
            this.playersInQueue[1].emit('redirect', '/game/match?matchID=' + matchID);
            this.playersInQueue = [];
        }
    }

    removeFromQueue(playerSocket: Socket) {
        for (var i = 0; i < this.playersInQueue.length; i++)
        {
            if (this.playersInQueue[i]['user'].username == playerSocket['user'].username)
            {
                this.playersInQueue.splice(i, 1);
                console.log(playerSocket['user'].username + ' is removed from queue');
                break;
            }
        }
    }

    clearFriendRoom = (froomID: string) => {
        for (var i = 0; i < this.friendRooms.length; i++)
        {
            if (this.friendRooms[i][0] == froomID)
            {
                this.friendRooms.splice(i, 1);
                break;
            }
        }
    }


    getGames(): Array<GameInstance> {
        return this.gameList;
    }
    clearFinishedGames() {
        for (var i = 0; i < this.gameList.length; i++)
        {
            console.log('Checking Room ' + this.gameList[i].gameInfo.gameRoom + ' '+ this.gameList[i].gameEnded);
            if (this.gameList[i].gameEnded == true)
            {
                this.clearFriendRoom(this.gameList[i].gameInfo.gameRoom);
                this.gameList.splice(i, 1);
                this.gameRoomList.splice(i, 1);
                i--;
                console.log('Room Cleared');
            }
        }
    }

} 
