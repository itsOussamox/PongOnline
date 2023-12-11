import { userInfo } from "@/app/types"
function ButtonAdd({txt, w, h}:{txt:string, w:string, h:string})
{
    return <button className={`buttonColor ${w} ${h} rounded-lg`}>{txt}</button>
}

export default function ChatInfo({user}:{user:userInfo})
{
    return(
        <div className="secondaryBackground w-1/4 max-w-xs flex flex-col items-center h-4/5 rounded-lg ">
            <div className="w-full flex flex-col items-center justify-evenly h-1/3 mt-10 textColor" >
                <img className="w-32 h-32 rounded-full" src={user.imageUrl} alt="profile pic"/>
                <div className="flex flex-col items-center">
                    <h3 className="">{user.userName}</h3>
                    <h5 className="text-sm text-slate-400">{user.title}</h5>
                </div>
            </div>
            <div className="w-44 h-24 flex flex-col justify-between">
                <div className="flex justify-between ">
                    <ButtonAdd txt="addF" w="w-20" h="h-10"/>
                    <ButtonAdd txt="addG" w="w-20" h="h-10"/>
                </div>
                <ButtonAdd txt="play" w="" h="h-10"/>
                {/* <button className="bg-blue-500 h-10">play</button> */}
            </div>
        </div>
    )
}