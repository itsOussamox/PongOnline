import { Paddle, Canvas, Player, Ball, GameInfo} from './interfaces/game.interface';
import { Engine, Body, World, Bodies, Vector, Events, Matter, Composite, Runner } from "matter-js";
import * as CircularJSON from 'circular-json';
import { Injectable } from "@nestjs/common";
import { Server, Socket } from 'socket.io';


const HEIGHT : number = 800;
const WIDTH : number = 1000;
const WALLHEIGHT : number = 1;
const PADDLEWIDTH : number = 15;
const PADDLEHEIGHT : number = 90;
const BALLRADIUS : number = 10;


@Injectable()
export class GameInstance {
    private engine: Engine;
    private runner: Runner;
    private canvas: Canvas;
    private playerOne: Player;
    private playerTwo: Player;
    private ball: Ball;
    public gameInfo: GameInfo;

    constructor(playerOneSocket: Socket, playerTwoSocket: Socket, roomNumber: string, serverIO: Server) {
        this.engine = Engine.create();
        this.engine.gravity.y = 0;
        this.canvas = {
            width: WIDTH,
            height: HEIGHT,
            topWall: Bodies.rectangle(WIDTH / 2, 1 / 2, WIDTH, WALLHEIGHT, { isStatic: true, render: { fillStyle: 'White' } }),
            bottomWall: Bodies.rectangle(WIDTH / 2, HEIGHT - 1 / 2, WIDTH, WALLHEIGHT, { isStatic: true, render: { fillStyle: 'White' } }),
            wallHeight: WALLHEIGHT,
            backgroundSkin: "black",
        };
        this.playerOne = {
            paddle: {
                bar: Bodies.rectangle(10, HEIGHT / 2, PADDLEWIDTH, PADDLEHEIGHT, { isStatic: true, render: { fillStyle: 'White' } }),
                barHeight: 70,
                barWidth: 15,
                xPosition: 10,
                yPosition: HEIGHT / 2,
                barSkin: 'null',
                move: 0,
            },
            score: 0,
            playerData: playerOneSocket['user'],
            playerSocket: playerOneSocket, 
        };
        this.playerTwo = {
            paddle: {
                bar: Bodies.rectangle(WIDTH - 10, HEIGHT / 2, PADDLEWIDTH, PADDLEHEIGHT, { isStatic: true, render: { fillStyle: 'White' } }),
                barHeight: 70,
                barWidth: 15,
                xPosition: WIDTH - 10,
                yPosition: HEIGHT / 2,
                barSkin: 'null',
                move: 0,
            },
            score: 0,
            playerData: playerTwoSocket['user'],
            playerSocket: playerTwoSocket,
        };
        this.ball = {
            ball: Bodies.circle(WIDTH / 2, HEIGHT / 2, BALLRADIUS, { restitution: 1, render: { fillStyle: 'Yellow' } }),
            ballVelocity: Vector.create(0, 0),
            ballSkin: 'null',
            ballSpeed: 6,
            ballAngle: 0,
            maxSpin: 5,
        };
        this.gameInfo = {
            frameRate: 1000 / 75,
            playersCounter: 0,
            gameRoom: roomNumber,
            IOserver: serverIO,
            roundStart: false,
            paddleSpeed: 3,
        };
        // this.runner = Matter.Runner.create();
        playerOneSocket.join(roomNumber);
        playerTwoSocket.join(roomNumber);
        
    }   
    collisionDetect = (event: Matter.IEventCollision<Matter.Engine>) =>{
        event.pairs.forEach((pair: Matter.IPair) => {
          const { bodyA, bodyB } = pair;
          if (bodyA == this.playerOne.paddle.bar || bodyA == this.playerTwo.paddle.bar)
          {
            let paddle = (bodyA == this.playerOne.paddle.bar) ? this.playerOne.paddle : this.playerTwo.paddle;
            let ballPosition = this.ball.ball.position;
            let paddlePosition = bodyA.position
            let deltaY = ballPosition.y - paddlePosition.y;
            let normalizedDeltaY = deltaY / (paddle.barHeight / 2);
            if (normalizedDeltaY > 1)
                normalizedDeltaY = 1
            else if (normalizedDeltaY < -1)
                normalizedDeltaY = -1
            this.ball.ballVelocity.y = this.ball.ballVelocity.y + this.ball.maxSpin * normalizedDeltaY;
            this.ball.ballVelocity.x = this.ball.ballVelocity.x * -1;
            let speed = Math.sqrt(this.ball.ballVelocity.x ** 2 + this.ball.ballVelocity.y ** 2);
            this.ball.ballVelocity.x = (this.ball.ballVelocity.x / speed) * this.ball.ballSpeed
            this.ball.ballVelocity.y = (this.ball.ballVelocity.y / speed) * this.ball.ballSpeed
            this.ball.ballVelocity = Vector.create(this.ball.ballVelocity.x, this.ball.ballVelocity.y)
          }
          if ((bodyA == this.canvas.topWall || bodyA == this.canvas.bottomWall) && (bodyB == this.ball.ball))
          {
            this.ball.ballVelocity.y = this.ball.ballVelocity.y * -1;
            this.ball.ballVelocity = Vector.create(this.ball.ballVelocity.x, this.ball.ballVelocity.y)
          }
        });
    }
    addSpectator = (socket: Socket) => {
        
        socket.join(this.gameInfo.gameRoom);
        socket.emit('startGame', {
            playersScore: [this.playerOne.score, this.playerTwo.score],
            barA_data: [this.playerOne.paddle.bar.position, this.playerOne.paddle.bar.velocity],
            barB_data: [this.playerTwo.paddle.bar.position, this.playerTwo.paddle.bar.velocity],
            topWall_data: [this.canvas.topWall.position, this.canvas.topWall.velocity],
            bottomWall_data: [this.canvas.bottomWall.position, this.canvas.bottomWall.velocity],
            ball_data: [this.ball.ball.position, this.ball.ball.velocity]
        });
        console.log('spectator added')
    }
    gameLoop = () => {
        if (this.gameInfo.roundStart == false) {
            this.gameInfo.roundStart = true;
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            setTimeout(() => {
                this.ball.ballVelocity.x = (Math.random() < 0.5) ? -5 : 5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
        if (this.ball.ball.position.x < 0) {
            this.playerTwo.score++;
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            setTimeout(() => {
                this.ball.ballVelocity.x = -5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        if (this.ball.ball.position.x > this.canvas.width) {
            this.playerOne.score++;
            this.ball.ballVelocity.x = 0;
            this.ball.ballVelocity.y = 0;
            Body.setVelocity(this.ball.ball, this.ball.ballVelocity);
            Body.setPosition(this.ball.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
            setTimeout(() => {
                this.ball.ballVelocity.x = 5;
                this.ball.ballVelocity.y = 0;
            }, 3000);
        }
        // handle the case where the ball keeps colliding with a single wall vertically and slows down
        if (this.gameInfo.roundStart &&(this.ball.ball.velocity.x < 0 && this.ball.ball.velocity.x > -0.5))
            this.ball.ballVelocity.x = -5;
        if (this.gameInfo.roundStart && (this.ball.ball.velocity.x > 0 && this.ball.ball.velocity.x < 0.5))
            this.ball.ballVelocity.x = 5;
        if (this.playerOne.score == 5 || this.playerTwo.score == 5)
            this.endGame();
        if (this.wallWalk(this.playerOne) == false)
            Body.setPosition(this.playerOne.paddle.bar,
                 { x: this.playerOne.paddle.bar.position.x, y: this.playerOne.paddle.bar.position.y + (this.gameInfo.paddleSpeed * this.playerOne.paddle.move) });
        if (this.wallWalk(this.playerTwo) == false)
            Body.setPosition(this.playerTwo.paddle.bar,
                { x: this.playerTwo.paddle.bar.position.x, y: this.playerTwo.paddle.bar.position.y + (this.gameInfo.paddleSpeed * this.playerTwo.paddle.move) });

    }
    wallWalk (player: Player)  {
        if ((player.paddle.bar.position.y - player.paddle.barHeight / 2 <= this.canvas.wallHeight) && player.paddle.move == -1)
            return true;
        if ((player.paddle.bar.position.y + player.paddle.barHeight / 2 >= this.canvas.height - this.canvas.wallHeight) && (player.paddle.move == 1))
            return true;
        return false;
    }

    endGame = () => {
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('endGame', {
            playersScore: [this.playerOne.score, this.playerTwo.score],
            barA_data: [this.playerOne.paddle.bar.position, this.playerOne.paddle.bar.velocity],
            barB_data: [this.playerTwo.paddle.bar.position, this.playerTwo.paddle.bar.velocity],
            topWall_data: [this.canvas.topWall.position, this.canvas.topWall.velocity],
            bottomWall_data: [this.canvas.bottomWall.position, this.canvas.bottomWall.velocity],
            ball_data: [this.ball.ball.position, this.ball.ball.velocity, this.ball.ball.angle]
        });
    
    }
    sendFrame = () => {
        const worldState = JSON.stringify(Composite.allBodies(this.engine.world), (key, value) =>
        (key === 'parent' || key === 'parts' || key === 'body') ? undefined : value);
        // stringify the engine and send it
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('updateFrames', worldState);
    }
    animationFrame = () => {
        this.gameLoop();
        // this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('updateFrame', {
        //     playersCounter: this.gameInfo.playersCounter,
        //     playersScore: [this.playerOne.score, this.playerTwo.score],
        //     barA_data: [this.playerOne.paddle.bar.position, this.playerOne.paddle.bar.velocity],
        //     barB_data: [this.playerTwo.paddle.bar.position, this.playerTwo.paddle.bar.velocity],
        //     topWall_data: [this.canvas.topWall.position, this.canvas.topWall.velocity],
        //     bottomWall_data: [this.canvas.bottomWall.position, this.canvas.bottomWall.velocity],
        //     ball_data: [this.ball.ball.position, this.ball.ball.velocity, this.ball.ball.angle]
        // });
        }
    startFriendGame = () => {
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('startFriendGame', {
            canvasInfo: [this.canvas.width, this.canvas.height, this.canvas.wallHeight],
            bodiesInfo: [this.playerOne.paddle.barHeight, this.playerOne.paddle.barWidth,
                        BALLRADIUS,]
        });
        this.playerOne.playerSocket.on('onMove', (movement : number) => {
            this.playerOne.paddle.move = movement;
        });
        this.playerTwo.playerSocket.on('onMove', (movement : number) => {
            this.playerTwo.paddle.move = movement;
        });
        World.add(this.engine.world, [this.canvas.topWall, this.canvas.bottomWall, this.playerOne.paddle.bar,
             this.playerTwo.paddle.bar, this.ball.ball]);
        Events.on(this.engine, 'collisionStart', this.collisionDetect);
        console.log('A Friend Game just started');
        Runner.run(this.engine)
        setInterval(this.sendFrame, 1000/60);
        setInterval(this.animationFrame , 1000/60);
    }

    startGame = () => {
        this.gameInfo.IOserver.to(this.gameInfo.gameRoom).emit('startGame', {
            playersScore: [this.playerOne.score, this.playerTwo.score],
            barA_data: [this.playerOne.paddle.bar.position, this.playerOne.paddle.bar.velocity],
            barB_data: [this.playerTwo.paddle.bar.position, this.playerTwo.paddle.bar.velocity],
            topWall_data: [this.canvas.topWall.position, this.canvas.topWall.velocity],
            bottomWall_data: [this.canvas.bottomWall.position, this.canvas.bottomWall.velocity],
            ball_data: [this.ball.ball.position, this.ball.ball.velocity]
        });
        this.playerOne.playerSocket.on('onMove', (movement : number) => {
            this.playerOne.paddle.move = movement;
        });
        this.playerTwo.playerSocket.on('onMove', (movement : number) => {
            this.playerTwo.paddle.move = movement;
        });
        World.add(this.engine.world, [this.canvas.topWall, this.canvas.bottomWall, this.playerOne.paddle.bar,
             this.playerTwo.paddle.bar, this.ball.ball]);
        Events.on(this.engine, 'collisionStart', this.collisionDetect);
        setInterval(this.animationFrame , 1000/120);
    }
}