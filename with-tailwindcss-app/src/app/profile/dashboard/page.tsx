"use client"

import React, { useEffect, useState, ReactNode} from 'react';
import Sidebar from '../components/dashboard/sidebar/sidebar';
import Skins from '../components/dashboard/skins/skins';
import Friends from '../components/dashboard/friends/friends';
import Achievement from '../components/dashboard/achievements/achievement';
import Statistics from '../components/dashboard/statistics/statistics';
import aoumad from '../imgs/aoumad.jpeg';
import yamon from '../imgs/ael-yamo.jpeg';


function App() {
  interface UserData {
    id: string;
    username: string;
    profilePic: string;
    title: string;
    wallet: number;
    hash: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [SidebarInfo, setSidebarInfo] = useState({
    id: "",
    username: "",
    title: "",
    profilePic: "",
    wallet: 0,
    online: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/user/profile", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("-------");
          console.log(data);
          setUserData(data);
          console.log('>>>>>>>>>',data.profilePic);
          setSidebarInfo({
            id: data.id,
            username: data.username,
            title: data.title, 
            profilePic: data.profilePic,
            wallet: data.wallet, 
            online: true,
          });
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const friendsList = [
    { id: "1", name: "Friend 1", picture: aoumad.src },
    { id: "2", name: "Friend 2", picture: aoumad.src },
    { id: "3", name: "Friend 3", picture: aoumad.src },
    { id: "4", name: "Friend 4", picture: aoumad.src },
    { id: "5", name: "Friend 5", picture: aoumad.src },
    { id: "6", name: "Friend 6", picture: aoumad.src },
    { id: "7", name: "Friend 7", picture: aoumad.src },
    { id: "8", name: "Friend 8", picture: aoumad.src },
  ];

  const FriendRequests = [
    { id: "1", name: "Friend 1", picture: yamon.src },
    { id: "2", name: "Friend 2", picture: yamon.src },
    { id: "3", name: "Friend 3", picture: yamon.src },
    { id: "4", name: "Friend 4", picture: yamon.src },
    { id: "5", name: "Friend 5", picture: yamon.src },
    { id: "6", name: "Friend 6", picture: yamon.src },
    { id: "7", name: "Friend 7", picture: yamon.src },
    { id: "8", name: "Friend 8", picture: yamon.src },
  ];


  return (
    <>
      <div className="App">
        <div className="AppGlass">
          <Sidebar sidebar={SidebarInfo} />
          <Skins />
          <Achievement />
          <Statistics />
          <Friends friends={friendsList} friendsReq={FriendRequests} />
        </div>
      </div>
      {/* {children} */}
    </>
  );
};

export default App;


// import type { Metadata } from 'next'
// import { useState, useEffect, use } from 'react'
// import { Inter } from 'next/font/google'
// import './global.module.css'
// import Sidebar from '../components/dashboard/sidebar/sidebar'
// import Skins from '../components/dashboard/skins/skins'
// import Friends from '../components/dashboard/friends/friends'
// import aoumad from '../imgs/aoumad.jpeg'
// import yamon from '../imgs/ael-yamo.jpeg'
// import Achievement from '../components/dashboard/achievements/achievement'
// import Statistics from '../components/dashboard/statistics/statistics'
// // import Statistics from '../components/dashboard/Statistics/Statistics'

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {

//   const [data, setData] = useState({
//     sidebarInfo: {} as any,
//   })

//   useEffect(() =>
//   {
//     // Fetch data from your backend API endpoint
//     const fetchData = async() => {
//       try {
//         const res = await fetch('http://localhost:3001/api/user/profile');
//         const json = await res.json();

//         setData({
//           sidebarInfo: json.sidebarInfo,
//         });
//         } catch (error) {
//           console.error('Error fetchin data: ', error);
//         }
//       };

//       fetchData();
//   }, []);

//   const friendsList = [
//     { id: "1", name: "Friend 1", picture: aoumad.src },
//     { id: "2", name: "Friend 2", picture: aoumad.src },
//     { id: "3", name: "Friend 3", picture: aoumad.src },
//     { id: "4", name: "Friend 4", picture: aoumad.src },
//     { id: "5", name: "Friend 5", picture: aoumad.src },
//     { id: "6", name: "Friend 6", picture: aoumad.src },
//     { id: "7", name: "Friend 7", picture: aoumad.src },
//     { id: "8", name: "Friend 8", picture: aoumad.src },
//   ];const sidebarInfo = { id: "1", name: "Friend 1", title: "title", picture: yamon.src };


// const FriendRequests = [
//     { id: "1", name: "Friend 1", picture: yamon.src },
//     { id: "2", name: "Friend 2", picture: yamon.src },
//     { id: "3", name: "Friend 3", picture: yamon.src },
//     { id: "4", name: "Friend 4", picture: yamon.src },
//     { id: "5", name: "Friend 5", picture: yamon.src },
//     { id: "6", name: "Friend 6", picture: yamon.src },
//     { id: "7", name: "Friend 7", picture: yamon.src },
//     { id: "8", name: "Friend 8", picture: yamon.src },
//   ];

//   const SidebarInfo = { id: "1", name: "mongo", title: "Depression", picture: yamon.src, wallet: 0, online: true };

//   return (
//     <>
//     <div className="App">
//       <div className="AppGlass">
//           <Sidebar sidebar={SidebarInfo}/>
//           <Skins/>
//           <Achievement />
//           <Statistics />
//           <Friends friends={friendsList} friendsReq={FriendRequests}/>
//       </div>
//     </div>
//         {children}
//     </>
//   )
// }