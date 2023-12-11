"use client";
import React, { FC, useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, World, Bodies, Body } from "matter-js";
import Cookies from 'js-cookie';
import './globals.css'
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import io from 'socket.io-client';     
import { Socket } from 'socket.io-client';

// const Gbackground = '/GameAssets/Gbackground.png';
const PaddleImg = '/GameAssets/OPaddle.png';
const BallImg = '/GameAssets/newBall.png';
const MdlImg = '/GameAssets/4kMDL.png';
interface SceneProps {}

const Scene: FC<SceneProps> = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const engine = useRef<Engine>(Matter.Engine.create());
  const render = useRef<Render>(null);
  const playerStateRef = useRef<number>(0);
    const [playerState, setPlayerState] = useState<number>(playerStateRef.current);
    const [inGame, setInGame] = useState<boolean>(false);
    const [gamesList, setGamesList] = useState<string[]>([]);
    const [playersScore, setPlayersScore] = useState<[number, number]>([0, 0]);
    const data = useRef<any>(null);
    const percentWidth = 85;
    const percentHeight = 80;
    function searchGame() {
        socketRef.current?.emit('requestJoinGame');
        if (playerStateRef.current === 0) {
            playerStateRef.current = 1;
            setPlayerState(playerStateRef.current);
          }
    }
    const spectateGame = (game: string) => {
      if (playerStateRef.current === 0) {
          socketRef.current?.emit('spectateGame', game);
          playerStateRef.current = 0.5;
          setPlayerState(playerStateRef.current);
        }
    }
    const adjustWidth = () => {
      var convertedWidth = (window.innerWidth * percentWidth) / 100;
      if (convertedWidth < 400)
        convertedWidth = 400;
      if (convertedWidth > 2200)
        convertedWidth = 2200;
      return convertedWidth;
    }

    const adjustHeight = () => {
      var convertedHeight = (window.innerHeight * percentHeight) / 100;
      if (convertedHeight < 300)
        convertedHeight = 300;
      if (convertedHeight > 1600)
        convertedHeight = 1600;
      return convertedHeight;
    }

    const getconvertedPaddle = (player: string, cPos : Matter.Vector) => {
      
      const convertedWidth = adjustWidth();
      const convertedHeight = adjustHeight();
      const paddleHeight = (convertedHeight * 11.25) / 100;
      // const paddleWidth = (convertedWidth * 1.5) / 100;
      const paddleWidth = 15;
      const xOffSet = (convertedWidth * 1) / 100;
      if (player === '1')
        return Bodies.rectangle(xOffSet, cPos.y, paddleWidth, paddleHeight, {
          isStatic: true,
          collisionFilter: {
            category: 0x0002,
            mask: 0x0002,
          },
          render: { 
            sprite: {texture:  PaddleImg, xScale: paddleWidth / 20, yScale: paddleHeight / 183},
            fillStyle: 'White' },
        });
      else
        return Bodies.rectangle(convertedWidth - xOffSet, cPos.y, paddleWidth, paddleHeight, {
          isStatic: true,
          collisionFilter: {
            category: 0x0002,
            mask: 0x0002,
          },
          render: { 
            sprite: {texture:  PaddleImg, xScale: paddleWidth / 20, yScale: paddleHeight / 183},
            fillStyle: 'White' },
        });
    }

    const getconvertedBall = (cPos : Matter.Vector) => {
      const convertedHeight = adjustHeight();
      var scale = (convertedHeight * 1.25) / 100;
      if (scale < 5)
        scale = 5;
      const ballRadius = scale;
      return Bodies.circle(cPos.x, cPos.y, ballRadius, {
        restitution: 1,
        render: { 
          // sprite: {texture:  BallImg, xScale: (ballRadius * 2) / 20, yScale: (ballRadius * 2) / 20},
          fillStyle: 'White' },
      });
    }

    const getconvertedPos = (pos: { x: number; y: number }) => {
      const convertedWidth = adjustWidth();
      const convertedHeight = adjustHeight();
      const oldWidth = 1000;
      const oldHeight = 800;
      const x = (pos.x * convertedWidth) / oldWidth;
      const y = (pos.y * convertedHeight) / oldHeight;
      return Matter.Vector.create(x, y);
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && !socketRef.current) {
          console.log('CONNECTED');
            socketRef.current = io("http://localhost:3001/api/game", { auth: { token: Cookies.get("access_token") } });
          }
        socketRef.current?.on('redirect', (destination : string, reason : string) => {
            window.location.href = destination;
            console.log('ALERTE : ' + reason);
            socketRef.current?.disconnect();
        })
        socketRef.current?.on('updateGameList', (newGamesList : string[])  => {
              setGamesList(newGamesList);
        });
        socketRef.current?.on('startGame', () => {
          if (playerStateRef.current <= 1)
          {
            if (playerStateRef.current === 0.5) // speacting mode
              playerStateRef.current = 3;
            else
              playerStateRef.current = 2;
            var convertedWidth = adjustWidth();
            var convertedHeight = adjustHeight();
            const frameRate: number = 1000 / 75;
            engine.current.gravity.y = 0;
            const gameWidth: number = convertedWidth;
            const gameHeight: number = convertedHeight;
            const wallHeight: number = 1;
            const ballCenterX: number = convertedWidth / 2;
            const ballCenterY: number = convertedHeight / 2;
            const barHeight: number = 70;
            const ybarA: number = convertedHeight / 2; // BarA Y Position
            const ybarB: number = convertedHeight / 2; // BarB Y Position
            const xbarA: number = 10; // BarA X Position
            const xbarB: number = convertedWidth - 10; // BarB X Position
            var middleBG = Bodies.rectangle(gameWidth / 2, gameHeight / 2, 
            gameWidth, gameHeight, {
              isStatic: true,
              collisionFilter: {
                category: 0x0002,
                mask: 0x0002,
              },
              render: { 
                sprite: {texture:  MdlImg, xScale: 2, yScale: 2},
                fillStyle: 'black'},
            });
            var topWall = Bodies.rectangle(gameWidth / 2, wallHeight / 2, gameWidth, wallHeight, {
              isStatic: true, 
              render: {opacity: 0,
                 fillStyle: 'White' },
            });
            var bottomWall = Bodies.rectangle(gameWidth / 2, gameHeight - wallHeight / 2, gameWidth, wallHeight, {
              isStatic: true,
              render: { opacity: 0,
                fillStyle: 'White' },
            });
            var barA = Bodies.rectangle(xbarA, ybarA, 15, barHeight, {
              isStatic: true,
              render: { 
                sprite: {texture: PaddleImg, xScale: 1, yScale: 1.15},
                fillStyle: 'White' },
            });
            var barB = Bodies.rectangle(xbarB, ybarB, 15, barHeight, {
              isStatic: true,
              render: { 
                sprite: {texture: PaddleImg, xScale: 1, yScale: 1.15},
                fillStyle: 'White' },
            });
            var ball = Bodies.circle(ballCenterX, ballCenterY, 5, {
              restitution: 1,
              render: { 
                // sprite: {texture: BallImg, xScale: 1, yScale: 1},
                fillStyle: 'White' },
            });
            Matter.World.add(engine.current.world, [middleBG ,barA, barB, topWall, bottomWall, ball]);
            socketRef.current?.on('updateFrame', (newData : any) => {
              setPlayersScore(newData.playersScore);
              data.current = newData;
            });
            render.current = Render.create({
              element: document.querySelector('#Scene') as HTMLElement,
              engine: engine.current,
              options: {
                width: (window.innerWidth * percentWidth) / 100,
                height: (window.innerHeight * percentHeight) / 100,
                wireframes: false,
                background: 'transparent',
              },
            });
            const update = () => {
              render.current!.canvas.width = adjustWidth();
              render.current!.canvas.height = adjustHeight();
              if (data.current) {
                  Matter.World.remove(engine.current.world, [topWall, bottomWall, middleBG, ball, barA, barB]);
                  barA = getconvertedPaddle('1', getconvertedPos(data.current.barA_data[0]));
                  barB = getconvertedPaddle('2', getconvertedPos(data.current.barB_data[0]));
                  middleBG = Bodies.rectangle(render.current!.canvas.width / 2, render.current!.canvas.height / 2,
                  render.current!.canvas.width, render.current!.canvas.height, {
                    isStatic: true,
                    collisionFilter: {
                      category: 0x0002,
                      mask: 0x0002,
                    },
                    render: { 
                      sprite: {texture:  "/GameAssets/Gbackground.png", xScale: render.current!.canvas.width / 800  , yScale: render.current!.canvas.height / 800},
                      fillStyle: 'black'},
                    });
                    topWall = Bodies.rectangle(convertedWidth / 2, wallHeight / 2, convertedWidth, wallHeight, {
                      isStatic: true,
                      render: { opacity: 0,
                        fillStyle: 'White' },
                    });
                    bottomWall = Bodies.rectangle(convertedWidth / 2, convertedHeight - wallHeight / 2, convertedWidth, wallHeight, {
                    isStatic: true,
                    render: { opacity: 0,
                      fillStyle: 'White' },
                    });
                  ball = getconvertedBall(getconvertedPos(data.current.ball_data[0]));
                  Matter.World.add(engine.current.world, [middleBG, topWall, bottomWall, barA, barB, ball]);
                  Matter.Body.setPosition(ball, getconvertedPos(data.current.ball_data[0]));
                  Matter.Body.setVelocity(ball, data.current.ball_data[1]);
                }
                Matter.Engine.update(engine.current);
                Matter.Render.world(render.current!);
                requestAnimationFrame(update);
              };
            requestAnimationFrame(update);
            document.addEventListener('keydown', pressHandle);
            document.addEventListener('keyup', releaseHandle);
            return () => {
              socketRef.current?.off('restartGame');
              socketRef.current?.off('joinedGame');
              socketRef.current?.off('updateFrame');
              socketRef.current?.off('updateGameList');
              socketRef.current?.off('startGame');
              socketRef.current?.off('redirect');
              document.removeEventListener('keydown', pressHandle);
              document.removeEventListener('keyup', releaseHandle);
              Render.stop(render.current!);
              World.clear(engine.current.world, false);
              Matter.Engine.clear(engine.current);
            };
          };
        });
    }, [playerStateRef.current]);
    const pressHandle = (e: KeyboardEvent) => {
      if (playerStateRef.current === 2){
        if (e.key === 'w' || e.key === 'ArrowUp') socketRef.current?.emit('onMove', -1);
          if (e.key === 's' || e.key === 'ArrowDown') socketRef.current?.emit('onMove', 1);
      }
    };
  
    const releaseHandle = (e: KeyboardEvent) => {
      if (playerStateRef.current === 2){
        if (e.key === 'w' || e.key === 'ArrowUp') socketRef.current?.emit('onMove', 0);
        if (e.key === 's' || e.key === 'ArrowDown') socketRef.current?.emit('onMove', 0);
    };
  };
  const getCurrentStateMsg = () => {
    switch (playerStateRef.current) {
      case 0:
        return 'PRESS JOIN GAME TO START';
      case 1:
        return 'Waiting for another player';
      case 2:
        return 'In game';
      case 3:
        return 'Spectating';
      default:
        return 'Unknown state';
    }
  };
  return (
    <div>
      <h1 className='gameState'>{getCurrentStateMsg()}</h1>
      {(playerStateRef.current === 0) ? <button className='buttonStart' onClick={searchGame}>Join game</button> : null}
        {(playerStateRef.current < 2) ? <button className='buttonTest' onClick={searchGame}>JOIN ALONE TO TEST</button> : null}
      <div className='scoreDisplay'>
        <div>Player 1: {playersScore[0]}</div>
        <div>Player 2: {playersScore[1]}</div>
      </div>
      {!playerStateRef.current ? <div className='gameList'>
        <h1>Game List</h1>
        <ul>
          {gamesList.map((game, index) => (
            <li key={index}>Game number {index + 1} {': '}  
              <button onClick={() => spectateGame(game)}>Spectate</button>
            </li>
          ))}
        </ul>
      </div> : null}
      <div className='RenderScene' id='Scene' />
    </div>
  );
};

export default Scene;