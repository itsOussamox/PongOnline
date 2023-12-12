"use client";
import React, {useRef, useEffect} from "react";
import './globals.css'
import Matter, { Engine, Render, World, Bodies, Body, Composite, Bounds } from "matter-js";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import Cookies from 'js-cookie';
import { Socket, io } from "socket.io-client";
import { parse } from "path";
import { type } from "os";


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
const paddleImg = '/GameAssets/OPaddle.png';
const paddleSkin : Skin = {
    path: paddleImg,
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
    // render.canvas.style.top = '10%';
    render.options.width = render.canvas.width;
    render.options.height = render.canvas.height;
    return scale;
}

var parsedBodies : Matter.Body[] = [];
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
    socketRef.on('updateFrames', (bodies : any, playersScore : any) => {
        parsedBodies = JSON.parse(bodies).map((bodyJson: Matter.Body) => Body.create(bodyJson));
        if (typeof window !== 'undefined')
        {
            Composite.clear(engine.world, false);
            const scale = scaleToWindow(render);
            Composite.add(engine.world, parsedBodies);
            Composite.scale(engine.world, scale, scale, {x: 0 ,y: 0})
            var i = 0;
            engine.world.bodies.forEach((body: Matter.Body) => {
            if ((i == 2 || i == 3) && body.render.sprite != undefined) {
                body.render.sprite.texture = paddleSkin.path;
                const bodyWidth = body.bounds.max.x - body.bounds.min.x;
                const bodyHeight = body.bounds.max.y - body.bounds.min.y;
                const scaleX = bodyWidth / paddleSkin.width;
                const scaleY = bodyHeight / paddleSkin.height;
                body.render.sprite.xScale = scaleX;
                body.render.sprite.yScale = scaleY;
                body.render.sprite.yOffset = 0.5 ;
                body.render.sprite.xOffset = 0.5 ;
              }
              i++;
            });
            Render.world(render);
            // update
        }
    });
};



const MatchScene = () => {
    const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const render = useRef<Render>(null);
    var   gameDataPos: object = {};
    const engine = useRef<Engine>(Matter.Engine.create());
    // check if window is defined (so if in the browser or in node.js)
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
            socketRef.current.on('startFriendGame', (playersData : any) => {
                engine.current.gravity.y = 0;
                // console.log(playersData);
                var playerOneImage = document.getElementById('playerOneImage') as HTMLImageElement;
                var playerTwoImage = document.getElementById('playerTwoImage') as HTMLImageElement;
                playerOneImage.src = playersData[0].profilePic;
                playerTwoImage.src = playersData[1].profilePic;
                handleGameLoop(socketRef.current!, engine.current, render.current!);
            });
    }
    return (
        // center the canvas
        <div id="parentDiv" className="flex flex-col h-full w-full justify-center items-center gap-[5vh]">
            <div id="TopBar" className="w-1/3 max-w-xs h-14 outline outline-2 bg-[#282C4E] rounded-b-lg"/>
            <div id="RenderMatch" className="flex flex-col items-center"/>
            <div id="scoreDisplay" className="flex flex-row space-x-2 gap-[1vw] bg-[#282C4E] h-16 ">
                <img id="playerOneImage" className="max-w-[64px] min-w-[64px] bg-white w-16 h-16 mb-2" />
                <div id="scoreOne" className="max-w-[64px] min-w-[64px] flex items-center justify-center text-lg font-bold w-16 h-16 text-white text-center">1</div>
                <div className="splitter"></div>
                <div id="scoreTwo" className="max-w-[64px] min-w-[64px] flex items-center justify-center text-lg font-bold w-16 h-16 text-white text-center">0</div>
                <img id="playerTwoImage" className="max-w-[64px] min-w-[64px] w-16 h-16 bg-white mb-2" />
            </div>
        </div>
    )
};

export default MatchScene;