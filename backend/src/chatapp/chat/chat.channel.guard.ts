import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY, Role } from "./roles.decorator";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";



@Injectable()
export class ChatChannelAdminGuard implements CanActivate{

    constructor(private readonly prismaChatService:PrismaChatService){}
    // constructor(private readonly reflector:Reflector, private readonly prismaChatService:PrismaChatService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("got to the guard");
        // maybe you can get is admin from the client request (JWT), to optimize the db quering 
        // const requieredRole = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);
        const {userId, channelId} = context.switchToHttp().getRequest().body

        // console.log("userId: ", userId, " channelId: ", channelId);

        const isAdminOnChannel = await this.prismaChatService.isAdminOnChannel(userId, channelId);

        // console.log("the requiered role: ", requieredRole);
        // if (requieredRole.some((role)=> role==='user')){
            // console.log("the guard would be activated");
            // return true 
        // }
        if (isAdminOnChannel){
            console.log("the user ", userId, " is an admin on: ", channelId);
            return true
        }

        return  false
    }
}