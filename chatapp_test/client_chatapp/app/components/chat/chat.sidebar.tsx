import { userInfo } from "@/app/types";
import MessageAssideItem from './chat.message.asside.item'
export default function ChatSideBar({userlist}:{userlist:userInfo[]}){
    return (
        <aside className="text-2xl w-1/5 max-w-sm mainBackground font-mono textColor rounded-lg" >
            {
                userlist.map((user)=>{
                    return(
                        <MessageAssideItem user={user}/>
                    );
                })
            }
        </aside>)
}
