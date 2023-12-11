import { Injectable } from "@nestjs/common";
// import { PrismaChatService } from "chatapp/server_chatapp/prisma/chat/prisma.chat.service";
import { CreateChannelDto } from "./DTOs/dto";
import { PrismaChatService } from "../prisma/chat/prisma.chat.service";

@Injectable()
export class ChannelService{
    constructor(private readonly prismaChatService:PrismaChatService){}

    // async createService(createChannelDto:CreateChannelDto){
    //     this.prismaChatService.createChannel(createChannelDto);
    // }

    // async joinChannel
}