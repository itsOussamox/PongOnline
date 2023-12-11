import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { get } from "http";
import { JwtGuard } from "src/Auth/auth_google/utils/jwt.guard";
import { RequestService } from "./request.service";
import { th } from "@faker-js/faker";
import { NOTIF_TYPE } from "@prisma/client";




@Controller('request')
export class RequestController {
    constructor(private readonly requestService : RequestService) { }
    
    //http://localhost:3001/api/request/send/:userId
    @Post('send/:userId')
    @UseGuards(JwtGuard)
    async sendRequest(@Param('userId') userId: string)
    {
      return  this.requestService.handleSendRequest(userId, "login sent you friend request", NOTIF_TYPE.friendReq);
    }


    //http://localhost:3001/api/request/accept/:notificationid
    @Post('accept/:notificationid')
    @UseGuards(JwtGuard)
    async acceptRequest(@Req() req: Request, @Res() res: Response, @Param('notificationid') notificationId: number)
    {
      return  this.requestService.handleAcceptRequest(req, notificationId)
    }


    //http://localhost:3001/api/request/Refuse/:notificationid
    @Post('Refuse/:notificationid')
    @UseGuards(JwtGuard)
    async refuse(@Param('notificationid') notificationId: number)
    {
       return this.requestService.handleRefuseRequest(notificationId)
    }
}