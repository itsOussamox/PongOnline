import ChatSideBar from "../components/chat/chat.sidebar"
import ChatMessagingContainers from "../components/chat/chat.messaging.container"
/* this should be a temp data*/
import { userInfo } from "../types";
import {fakeUser} from "../components/chat/chat.messaging.container"
const fakeUsers:userInfo[] = [
    fakeUser,
    fakeUser,
    fakeUser,
];
/* this should be a temp data ends here*/


export default function Chat() 
{
    return (<div className="flex flex-row flex-nowrap justify-evenly w-4/5 h-full m-auto mt-20">
        <ChatSideBar userlist={fakeUsers}/>
        <ChatMessagingContainers/>
    </div>);
}
        {/*add side bar */}
        {/*full chat*/}
            {/* chat */} {/* chat info */}
        {/*/full chat*/}