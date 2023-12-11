import React, {useState} from 'react';


interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}

// function startGameOnline(){
//     console.log('start game online');
//     setGameState('playing');
// }

export function GameMenu({setGameState, gameState}: GameMenuProps){

    return (
        <div>
            <h1>Game Menu</h1>
            <button style={{backgroundColor : 'blue'}} onClick={() => {setGameState('playing')}}>Start Game Online</button>
        </div>
    )
}