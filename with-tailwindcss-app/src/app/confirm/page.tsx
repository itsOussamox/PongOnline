"use client";
import { Backend_URL } from "@/lib/Constants";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaLinkedinIn,
  FaGoogle,
  FaEnvelope,
  FaRegEnvelope,
} from "react-icons/fa";
import { MdLabelOutline } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

type FormInputs = {
  username: string;
  profilePic: string;
  hash: string;
};
export default function Signup() {
  
  interface UserData {
    username: string;
    profilePic: string;
    hash: string;
  }

  // const [imagePreview, setImagePreview] = useState(
  //   "https://cdn.intra.42.fr/users/9881b3331d37fa6b6121528fa0aa990e/ael-yamo.jpg"
  // );

  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await fetch(Backend_URL + "auth/check", {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        if (res.ok) {
          setAuthenticated(true);
          const data = await res.json();
          // console.log(data);
          setUserData(data);
          // console.log("data=", data);
        } else {
          router.push("/");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
    console.log(userData);
  }, []);

  const confirm = async () => {
    const res = await fetch(Backend_URL + "user/confirm", {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        username: userData?.username,
        profilePic: userData?.profilePic,
        hash: userData?.hash,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log("------psss------");
    console.log(userData);
    if (!res.ok) {
      
      alert(res.statusText);
      return;
    }
    router.push("/profile");
    const response = await res.json();
    alert("User Registered!");
    console.log({ response });
  };

  const data = useRef<FormInputs>({
    username: "",
    profilePic: "",
    hash: "",
  });
  const gradientStyle = {
    background:
      "linear-gradient(170deg, rgba(255, 255, 255, 0.00) -50.22%, #040924 -9.3%, #111534 -1.17%, rgba(68, 71, 111, 0.96) 83.26%, rgba(154, 155, 211, 0.90) 136.85%)",
  };

   return (
     <div>
       {!authenticated ? (
         <Loading />
       ) : (
         <div
           style={{ background: "#050A27" }}
           className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center h-screen"
         >
           <h2 className=" text-white shadow-2xl  text-7xl font-bold mb-3">
             {" "}
             PONG
           </h2>
           <div
             style={{ background: "#9A9BD3", transform: "rotate(-137.42deg)" }}
             className="fixed top-4 left-36 w-[30px] h-[323px] rounded-lg"
           ></div>
           <div
             style={gradientStyle}
             className="  sm:w-2/4 w-80 p-1 rounded-md sm:block px-20"
           >
             <div className="py-10">
               <div className="flex flex-col items-center ">
                 <div className="flex items-center shrink-0 mb-7">
                   <label htmlFor="fileInput" className="cursor-pointer">
                     <img
                       id="preview_img"
                       className="w-20 h-auto object-cover rounded-full sm:w-24 md:w-32 lg:w-40 xl:w-48"
                       src={userData?.profilePic}
                       alt="Current profile photo"
                     />
                   </label>
                   <input
                     type="file"
                     id="fileInput"
                     accept="image/*"
                     className="hidden"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         const reader = new FileReader();
                         reader.onloadend = () => {
                           setUserData((prev) => ({
                             ...(prev as UserData),
                             profilePic: reader.result as string,
                           }));
                         };
                         reader.readAsDataURL(file);
                       }
                     }}
                   />
                 </div>
                 <div
                   style={{ background: "rgba(154, 155, 211, 0.20)" }}
                   className=" p-2 flex items-center mb-7 rounded-md w-full"
                 >
                   <input
                     value={userData?.username}
                     type="text"
                     name="Username"
                     placeholder="Username"
                     style={{ background: "rgba(154, 155, 211, 0)" }}
                     className=" outline-none text-sm flex-1 text-white"
                     // onChange={(e) => (data.current.username = e.target.value)}
                     onChange={(e) =>
                       setUserData(
                         (prev) =>
                           ({
                             username: e.target.value,
                             // id: prev?.id || undefined,

                             profilePic: prev?.profilePic || undefined,
                           } as UserData)
                       )
                     }
                   />
                 </div>
                 <div
                   style={{ background: "rgba(154, 155, 211, 0.20)" }}
                   className=" p-2 flex items-center mb-7 rounded-md w-full"
                 >
                   <input
                     type="password"
                     name="password"
                     placeholder="password"
                     value={userData?.hash}
                     style={{ background: "rgba(154, 155, 211, 0)" }}
                     className="outline-none text-sm flex-1"
                     onChange={(e) =>
                       setUserData(
                         (prev) =>
                           ({
                             hash: e.target.value,
                             username: prev?.username || undefined,
                             // id: prev?.id || undefined,
                             profilePic: prev?.profilePic || undefined,
                           } as UserData)
                       )
                     }
                   />
                 </div>
                 <div className="border-2 border-white w-10 inline-block mb-7"></div>
                 <Link
                   href=""
                   className=" m = 0 border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-sky-950 mb-7"
                   onClick={confirm}
                 >
                   Confirm
                 </Link>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}
