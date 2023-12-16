'use client';
import React, { useEffect, useRef, useState } from "react";
import Scene from "./Matchmaking";
import { GameMenu } from "./Menu";
import Matchmaking from "./Matchmaking";
interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}
export default function GameDisplay() {
    const [gameState, setGameState] = useState('menu');
    
  return (
      <div>
        {gameState === 'menu' && <GameMenu  setGameState={setGameState} gameState={gameState}/>}
        {gameState === 'playing' && <Matchmaking  setGameState={setGameState} gameState={gameState}/>}
      </div>
    );
}