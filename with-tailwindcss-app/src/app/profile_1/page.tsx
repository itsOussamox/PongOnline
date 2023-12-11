"use client"
import { Backend_URL } from '@/lib/Constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Profile() {
   const router = useRouter();
     const gradientStyle = {
    background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)',
     };
  interface UserData {
  id: string;
  email: string;
}
  
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch(Backend_URL + 'auth/check', {
        method: "GET",
        mode: 'cors',
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin':'*'
        },
    });
        if (res.ok) {
          setAuthenticated(true);
          const data = await res.json();
          setUserData(data);
        } else {
          router.push('/');
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

  checkAuthentication();
  console.log(userData)
  },[]);

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
        {authenticated && userData && (
        <div className='py-16'>
          <p className='bg-white'>User ID: {userData.id}</p>
          <p className='bg-white'>Email: {userData.email}</p>
        </div>
      )}

    </div>
  )
}

