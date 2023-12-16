

interface GameMenuProps {
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    gameState: string;
}


export default function PlayOnline({setGameState, gameState}: GameMenuProps) {
    return (
        <button className='linear-main rounded-lg bg-gradient-to-br w-[54vw] h-[80vh] text-white'
        onClick={() => {setGameState('playing')}}>
        <div className='w-[70%] h-[60%] bg-[#9A9BD380] mx-auto rounded-xl'>
            <div className='flex flex-col items-center justify-center h-full w-full gap-[2vh]'>
                <div className='h-[15%] w-[46%] text-[20px] text-start'>PLAY ONLINE</div>
            </div>
        </div>
        </button>
    )
}