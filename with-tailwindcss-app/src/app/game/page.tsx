'use client';
import React, { useEffect, useRef, useState } from "react";
import Scene from "./Scene";
import { GameMenu } from "./Menu";

export default function GameDisplay() {
    const [gameState, setGameState] = useState('menu');
  
  return (
      <div>
        {gameState === 'menu' && <GameMenu  setGameState={setGameState} gameState={gameState}/>}
        {gameState === 'playing' && <Scene />}
      </div>
    );
}