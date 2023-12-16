"use client";
import React, {useRef, useEffect, useState} from "react";
import './globals.css'
import Matter, { Engine, Render, World, Bodies, Body, Composite, Bounds } from "matter-js";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { IBodyRenderOptionsSprite } from 'matter-js';
import Cookies from 'js-cookie';
import { Socket, io } from "socket.io-client";
import { parse } from "path";
import { type } from "os";

// TO DO LIST:
            // 1. fix the profile pictures "border-radius" and "image not showing" issue.
            // 2. delete the game after it ends.
            // 4. add a timer for the game.
            // 5. add the offline game mode.
            // 6. add the online game mode.
            // 7. add Fog zone mini game.
interface Skin {
    path: string;
    width: number;
    height: number;
}

const HEIGHT : number = 800;
const WIDTH : number = 1500;
const PERCENTWIDTH = 100; // %
const PERCENTHEIGHT = 70; // %
const backgroundImg = '/GameAssets/Gbackground.png';
const ballSkin : Skin = {
    path: '/GameAssets/newBall.png',
    width: 20,
    height: 20,
};
const paddleSkin : Skin = {
    path: '/GameAssets/OPaddle.png',
    width: 20,
    height: 183, //px
};


const scaleToWindow  = (render: Render) => {
    const scaleX = ((window.innerWidth * PERCENTWIDTH) / 100) / WIDTH;
    const scaleY = ((window.innerHeight * PERCENTHEIGHT) / 100) / HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const scaledWidth = WIDTH * scale;
    const scaledHeight = HEIGHT * scale;
    render.canvas.width = scaledWidth;
    render.canvas.height = scaledHeight;
    render.canvas.style.backgroundImage = `url(${backgroundImg})`;
    render.canvas.style.backgroundPosition = 'center';
    render.canvas.style.backgroundSize = 'cover';
    render.canvas.style.borderRadius = '10px';
    render.canvas.style.width = scaledWidth + 'px';
    render.canvas.style.height = scaledHeight + 'px';
    render.canvas.style.margin = 'auto';
    render.options.width = render.canvas.width;
    render.options.height = render.canvas.height;
    return scale;
}

var parsedBodies : Matter.Body[] = [];

const handleEndGame = (endGameData : any) => {
    const winner = (endGameData.winner === '1') ? document.getElementById('playerOneImage')!
    : document.getElementById('playerTwoImage')!;
    const loser = (endGameData.winner === '1') ? document.getElementById('playerTwoImage')!
    : document.getElementById('playerOneImage')!;
    winner.style.border = '5px solid green';
    winner.style.borderRadius = '50%';
    loser.style.border = '5px solid red';
    loser.style.borderRadius = '50%';
    setTimeout(() => {
        window.location.href = '/';
    }, 5000);
}

const handleGameLoop = (socketRef: Socket, engine: Engine, render: Render) => {
        render = Render.create({
            element: document.getElementById('RenderMatch') as HTMLElement,
            engine: engine,
            options: {
                wireframes: false,
                background: 'transparent',
            },
            });
        var i : number = 0;
        socketRef.on('updateFrames', (bodies : any, playersScore : any, playersData : any) => {
            parsedBodies = JSON.parse(bodies).map((bodyJson: Matter.Body) => Body.create(bodyJson));
            var playerOneImage = document.getElementById('playerOneImage')! as HTMLImageElement;
            var playerTwoImage = document.getElementById('playerTwoImage')! as HTMLImageElement;
            document.getElementById('scoreOne')!.innerHTML = playersScore[0];
            document.getElementById('scoreTwo')!.innerHTML = playersScore[1];
            playerOneImage.src = playersData[0].profilePic;
            playerTwoImage.src = playersData[1].profilePic;
            if (typeof window !== 'undefined')
            {
                render.element = document.getElementById('RenderMatch') as HTMLElement;
                render.options.wireframes = false;
                if (DEBUG)
                    render.options.wireframes = true;
                Composite.clear(engine.world, false);
                const scale = scaleToWindow(render);
                Composite.add(engine.world, parsedBodies);
                Composite.scale(engine.world, scale, scale, {x: 0 ,y: 0})
                var i = 0;
                var ballBody : Matter.Body = engine.world.bodies[4];
                engine.world.bodies.forEach((body: Matter.Body) => {
                    if ((i === 2 || i === 3) && body.render.sprite !== undefined) {
                        const sprite = body.render.sprite as any;
                        sprite.texture = paddleSkin.path;
                        const vertices = body.vertices;
                        const bodyWidth = Math.abs(vertices[1].x - vertices[0].x);
                        const bodyHeight = Math.abs(vertices[2].y - vertices[0].y);
                        const scaleX = bodyWidth / paddleSkin.width;
                        const scaleY = bodyHeight / paddleSkin.height;
                        sprite.xScale = scaleX;
                        sprite.yScale = scaleY;
                        sprite.xOffset = 0.5;
                        sprite.yOffset = 0.5;
                    }
                    if (i === 4 && body.render.sprite != undefined)
                    {
                        // body.render.sprite = undefined;
                        const sprite = body.render.sprite as any;
                        body.render.sprite.texture = ballSkin.path;
                        const scaleX = body.circleRadius! * 2 / ballSkin.width;
                        const scaleY = body.circleRadius! * 2 / ballSkin.height;
                        // const scale = Math.min(scaleX, scaleY);
                        sprite.xScale = scaleX;
                        sprite.yScale = scaleY;
                        sprite.yOffset = 0.5;
                        sprite.xOffset = 0.5;
                    }
                i++;
            });
            Render.world(render);
        }
    });
};

var DEBUG = false;
const pressHandle = (e: KeyboardEvent, socket : Socket) => {
      if (e.key === 'w' || e.key === 'ArrowUp') socket.emit('onMove', -1);
     if (e.key === 's' || e.key === 'ArrowDown') socket.emit('onMove', 1);
    if (e.key === 'b'){
        if (DEBUG === false)
            DEBUG = true;
        else
            DEBUG = false;
    }
};

  const releaseHandle = (e: KeyboardEvent, socket : Socket) => {
      if (e.key === 'w' || e.key === 'ArrowUp') socket.emit('onMove', 0);
      if (e.key === 's' || e.key === 'ArrowDown') socket.emit('onMove', 0);
};



const MatchScene = () => {
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const render = useRef<Render>(null);
    const engine = useRef<Engine>(Matter.Engine.create());
    if (typeof window !== 'undefined') {
        // useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const authToken = Cookies.get('access_token');
        const matchID = queryParams.get('matchID');
        // check if MatchID and authToken are defined
        if (matchID === null || authToken === undefined)
        {
            alert('MatchID is null or authToken is undefined');
            window.location.href = '/';
        }
        if (socketRef.current === null)
            socketRef.current = io("http://localhost:3001/api/game",
            {auth: {token: authToken, matchID: matchID}});
        socketRef.current.on('redirect', (destination : string , reason : string) => {
            alert(reason); 
            window.location.href = destination;
        });
        console.log('hna');
        socketRef.current.on('startFriendGame', (playersData : any) => {
            socketRef.current!.on('endGame', handleEndGame);
            document.addEventListener('keydown', (e) => 
            pressHandle(e, socketRef.current!));
            document.addEventListener('keyup', (e) => 
            releaseHandle(e, socketRef.current!));
            engine.current.gravity.y = 0;
            handleGameLoop(socketRef.current!, engine.current, render.current!);
        });
    }

    return (
        // isLoaded ? (
            <div id="parentDiv" className="flex flex-col h-full w-full justify-center items-center gap-[5vh]">
                <div id="TopBar" className="w-1/3 max-w-xs h-14 outline outline-2 bg-[#282C4E] rounded-b-lg" />
                <div id="RenderMatch" className="flex flex-col items-center" />
                <div id="scoreDisplay" className="flex flex-row space-x-2 gap-[1vw] bg-[#282C4E] h-16 ">
                    <img id="playerOneImage" className="min-w-[64px] max-w-[64px] w-[4vw] h-16 bg-white mb-2" />
                    <div id="scoreOne" className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center">0</div>
                    <div className="splitter"></div>
                    <div id="scoreTwo" className="flex items-center justify-center text-lg font-bold w-[4vw] h-16 text-white text-center">0</div>
                    <img id="playerTwoImage" className=" min-w-[64px] max-w-[64px] w-[4vw] h-16 bg-white mb-2" />
                </div>
            </div>
        // ) : null
    );
};

export default MatchScene;