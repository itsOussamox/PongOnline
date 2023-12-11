import { Socket } from "socket.io"

export type ConnectedSocketInfo = {
    socket: Socket,
    userId: string,
    // username: string,
    roomId?: string,
    roomName?: string
}