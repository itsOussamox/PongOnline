import { userInfo } from "@/app/types";

export default function MessageAssideItem({user}:{user:userInfo})
{
    return(
        <div className="flex items-center secondaryBackground m-3 rounded-lg h-16 ">
            <img className="w-12 h-12 rounded-full px-2 box-content" src={user.imageUrl} alt="friend profile pic" />
            <div>
                <h3 className="text-sm" >{user.userName}</h3>
                <p className="text-xs">{user.lastMessage}</p>
            </div>
        </div>
    )
}