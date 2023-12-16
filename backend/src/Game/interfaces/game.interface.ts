import { Engine, Body, World, Bodies, Vector, Events } from "matter-js";
import { Server, Socket } from "socket.io";
import { User } from "@prisma/client";


interface Canvas {
    width: number;
    height: number;
    topWall: Body;
    bottomWall: Body;
    wallHeight: number;
    backgroundSkin: string;
}

interface Paddle {
    bar: Body;
    barHeight: number;
    barWidth: number;
    xPosition: number;
    yPosition: number;
    barSkin: string;
    move: number;
}

interface Player {
    paddle: Paddle;
    score: number;
    playerData: User;
    playerSocket: Array<Socket>;
}

interface Ball {
    ball: Body;
    ballVelocity: Vector;
    ballSkin: string;
    ballSpeed: number;
    ballAngle: number;
    maxSpin: number;
}

interface GameInfo {
    frameRate: number;
    playersCounter: number;
    gameRoom: string;
    IOserver: Server;
    roundStart: boolean;
    paddleSpeed: number;
    winScore: number;
}

interface EndGameState {
    reason: string;
    winner: Player;
}

export { Canvas, Paddle, Player, Ball, GameInfo, EndGameState };
