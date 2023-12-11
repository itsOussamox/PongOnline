import { messageType } from "../../types"
export default function Message({message}:{message:messageType})
{
    return(
        <div className="bg-slate-100 my-4 w-max max-w-80 p-3 rounded-r buttonColor">
            {/* <h1>{message.senderId}</h1> */}
            <p className=" pb-2 ">{message.message}</p>
            <h6 className="text-xs ">{message.timeSent}</h6>
        </div>
    )
}