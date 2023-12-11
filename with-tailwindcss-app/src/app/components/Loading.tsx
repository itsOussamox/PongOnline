import React from 'react'

export default function Loading() {
         const gradientStyle = {
    background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
     };
  return (
      <div style={{ background: '#050A27' }} className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen">
      <div style={gradientStyle} className='fixed top-8 left-1/4 transform -translate-x-1/2 -rotate-6 w-[20vh] h-[40vh] rounded-lg'></div>
        <div style={{ background: '#9A9BD3'  } } className='fixed top-8 right-1/4 transform translate-x-1/2 rotate-6 w-[5vh] h-[40vh] rounded-lg '></div>
      <div className="flex space-x-2">
        <div style={{ background: '#9A9BD3'}} className="w-[1.5vh] h-[1.5vh] bg-black rounded-full animate-bounce"></div>
        <div style={{ background: '#9A9BD3'}} className="w-[1.5vh] h-[1.5vh] bg-black rounded-full animate-bounce"></div>
        <div style={{ background: '#9A9BD3'}} className="w-[1.5vh] h-[1.5vh] bg-black rounded-full animate-bounce"></div>
        <h2 style={{ color: '#9A9BD3' }} className='font-bold animate-bounce flex"'> loading </h2>
      </div>
       
    </div>
  )
}
