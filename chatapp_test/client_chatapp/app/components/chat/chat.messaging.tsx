import { messageType } from '../../types'
import Message from './chat.message'


// const mess:messageType[] = 
export default function ChatMessaging({messages}:{messages: messageType[]})
{
    return(
        <div className='w-3/4 h-full flex flex-col justify-between pb-20 pr-10'>
            <div>
                {(messages.map((msg:messageType)=>(
                    <Message message={msg}/>
                )))}
            </div>
            <input className='w-full h-11 rounded-lg px-5 outline-none self-center ' type="text" placeholder='type something'/>
        </div>
    )
}