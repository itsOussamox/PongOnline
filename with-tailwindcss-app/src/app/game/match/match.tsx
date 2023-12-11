"use client";
import React, {useRef, useEffect} from "react";
import './globals.css'
import Matter, { Engine, Render, World, Bodies, Body, Composite, Runner } from "matter-js";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import Cookies from 'js-cookie';
import CircularJSON from 'circular-json';
import { Socket, io } from "socket.io-client";

interface MatchBodies {
    barA: Matter.Body;
    barB: Matter.Body;
    ball: Matter.Body;
    topWall: Matter.Body;
    bottomWall: Matter.Body;
}
var   gBodies : MatchBodies = {
    barA: Bodies.rectangle(0, 0, 0, 0),
    barB: Bodies.rectangle(0, 0, 0, 0),
    ball: Bodies.circle(0, 0, 0),
    topWall: Bodies.rectangle(0, 0, 0, 0),
    bottomWall: Bodies.rectangle(0, 0, 0, 0),
};

const addBodies = (engine: Engine, gameDataPos: any, gameData: any) => {
    // handle gbodies undefined
    if (gBodies.barA === undefined || gBodies.barB === undefined || gBodies.ball === undefined ||
        gBodies.topWall === undefined || gBodies.bottomWall === undefined)
        {
            console.log('gBodies undefined');
            return;
        }
    gBodies.bottomWall = Bodies.rectangle(gameDataPos.bottomWall_data[0].x, gameDataPos.bottomWall_data[0].y,
        gameData.canvasInfo[0], gameData.canvasInfo[2], { isStatic: true });
    gBodies.topWall = Bodies.rectangle(gameDataPos.topWall_data[0].x, gameDataPos.topWall_data[0].y,
        gameData.canvasInfo[0], gameData.canvasInfo[2], { isStatic: true });
    gBodies.barA = Bodies.rectangle(gameDataPos.barA_data[0].x, gameDataPos.barA_data[0].y,
        gameData.bodiesInfo[1], gameData.bodiesInfo[0], { isStatic: true });
    gBodies.barB = Bodies.rectangle(gameDataPos.barB_data[0].x, gameDataPos.barB_data[0].y,
        gameData.bodiesInfo[1], gameData.bodiesInfo[0], { isStatic: true }); 
    gBodies.ball = Bodies.circle(gameDataPos.ball_data[0].x, gameDataPos.ball_data[0].y,
        gameData.bodiesInfo[2], { isStatic: false });
    World.add(engine.world, [gBodies.bottomWall, gBodies.topWall, gBodies.barA,
         gBodies.barB, gBodies.ball]);
    console.log('added bodies');
};

const updateBodies = (engine: Engine, gameDataPos: any) => {
    Body.setPosition(gBodies.barA, gameDataPos.barA_data[0]);
    Body.setPosition(gBodies.barB, gameDataPos.barB_data[0]);
    Body.setPosition(gBodies.topWall, gameDataPos.topWall_data[0]);
    Body.setPosition(gBodies.bottomWall, gameDataPos.bottomWall_data[0]);
    Body.setPosition(gBodies.ball, gameDataPos.ball_data[0]);
    Body.setVelocity(gBodies.ball, gameDataPos.ball_data[1]);
}

const drawBodies = (bodies: Matter.Body[], ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, 1000, 800);
        ctx.fillStyle = "#3D6BBC";
        ctx.strokeStyle = "#132545";
        bodies.forEach((body) => {
            var vertices = body.vertices;
            ctx.beginPath();
            vertices.forEach((vertex) => {ctx.lineTo(vertex.x, vertex.y);});
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

}

let lastUpdateTimestamp = 0;
const updateInterval = 1000 / 120;
let parsedBodies : Matter.Body[] = [];
const handleGameLoop = (socketRef: Socket, gameData: object, engine: Engine, render: Render, gameDataPos : any) => {
    render = Render.create({
        element: document.getElementById('RenderMatch') as HTMLElement,
        engine: engine,
        options: {
            width: 1000,
            height: 800,    
            wireframes: true,
            background: 'transparent',
        },
      });
    socketRef.on('updateFrames', (bodies) => {
        parsedBodies = JSON.parse(bodies).map((bodyJson: Matter.Body) => Body.create(bodyJson));
    });

    
    //   var firstFrame : boolean = true;
    // socketRef.on('updateFrame', (newData: object) => {
    //     gameDataPos = newData;
    //      console.log('FF = ', firstFrame);
    //     if (firstFrame && gameDataPos.topWall_data !== undefined)
    //     {
    //         addBodies(engine, gameDataPos, gameData);
    //         firstFrame = false;
    //     }
    //     if (gameDataPos)
    //     {
    //         updateBodies(engine, gameDataPos);
    //         // Engine.update(engine, 1000 / 60);
    //         Render.world(render); 
    //     }

    // });

    const canvas = document.querySelector("#game");
    // const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    const update = () => {
        Composite.clear(engine.world, false);
        World.add(engine.world, parsedBodies); // more optimised way
        if (canvas !== null && canvas !== undefined)
            render.canvas = canvas as HTMLCanvasElement;
        // if (ctx !== undefined && ctx !== null)
        //     drawBodies(engine.world.bodies, ctx);
        Engine.update(engine, 1000/60);
        Render.world(render);
    };
    setInterval(update, 1);
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
                // console.log('MatchID is null or authToken is undefined');
                window.location.href = '/';
            }
            if (socketRef.current === null)
                socketRef.current = io("http://localhost:3001/api/game",
                {auth: {token: authToken, matchID: matchID}});
            socketRef.current.on('redirect', (destination : string , reason : string) => {
                alert(reason); 
                window.location.href = destination;
            });
            socketRef.current.on('startFriendGame', (data : object) => {
                engine.current.gravity.y = 0;
                const gameData = data;
                handleGameLoop(socketRef.current! ,gameData, engine.current, render.current!, gameDataPos);
            });
    }
    return (
        <div id="MatchElem">
            {/* <canvas className="game" id="game" width="1000" height="800"></canvas> */}
            <div className="RenderMatch" id="RenderMatch"/>
        </div>
    )
};

export default MatchScene;