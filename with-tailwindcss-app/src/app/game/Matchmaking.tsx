"use client";
import React, {useRef, useState } from 'react';
import Cookies from 'js-cookie';
import './globals.css'
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import io from 'socket.io-client';     
import { Socket } from 'socket.io-client';
interface GameMenuProps {
  setGameState: React.Dispatch<React.SetStateAction<string>>;
  gameState: string;
}

const Matchmaking = ({setGameState, gameState}: GameMenuProps) => {
  const [queueTimer , setQueueTimer] = useState<number>(-1);
  const [inQueue, setInQueue] = useState<boolean>(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const INTERVAL = useRef<NodeJS.Timeout | null>(null);
  const joinQueue = () => {
    setQueueTimer(0);
    setInQueue(true);
    if (!socketRef.current)
      socketRef.current = io("http://localhost:3001/api/matchmaking",
        {auth: {token: Cookies.get('access_token')}});
        INTERVAL.current = setInterval(() => {
        setQueueTimer(queueTimer => queueTimer + 1);
    }, 1000);
      socketRef.current.on('CancelQueue', () => {
          clearInterval(INTERVAL.current!);
          socketRef.current?.disconnect();
          socketRef.current = null;
          setGameState('menu');
          console.log('CancelQueue');
      });
      socketRef.current.on('redirect', (destination : string) => {
          clearInterval(INTERVAL.current!);
          socketRef.current?.disconnect();
          socketRef.current = null;
          if (typeof window !== 'undefined') {
            window.location.href = destination;
          }
        });
      console.log('joined matchmaking');
    };
    
    const cancelQueue = () => {
      clearInterval(INTERVAL.current!)
      socketRef.current?.emit('CancelQueue');
      socketRef.current?.disconnect();
      socketRef.current = null;
      setQueueTimer(-1);
      setInQueue(false);
      console.log('canceled matchmaking')
    }
    const goBack = () => {
      socketRef.current?.emit('CancelQueue');
      socketRef.current?.disconnect();
      socketRef.current = null;
      setQueueTimer(-1);
      setInQueue(false);
      setGameState('menu');
    }
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      {!inQueue ? <button className='buttonStart ' onClick={joinQueue}>Join game</button>
      : <button className='buttonStart ' onClick={cancelQueue}>Cancel</button>}
      
      <h1 className='text-white'>{(queueTimer >= 0) ? 'In Queue... ' + queueTimer + ' sec' : null}</h1>
      <button className='buttonStart' onClick={goBack}>Back to menu</button>
    </div>
  );
};

export default Matchmaking;