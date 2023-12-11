import { Body, ConsoleLogger, Controller, Get, HttpException, HttpStatus, Injectable, Patch, Post } from "@nestjs/common";
import { TmpUserService } from "./tmpUserAdd.service";
// import { StratDMDto } from "chatapp/server_chatapp/chat/types/user";
import { PrismaChatService } from "./chat/prisma.chat.service";
import { StratDMDto } from "../chat/types/user";

// @Injectable()
@Controller('users')
export class TmpUserController{

    constructor(private readonly tmpUserAddService:TmpUserService, private readonly prismaChatService:PrismaChatService){}

    @Post('addUser')
    async addUser(@Body() data: any){

        console.log(data);
        const user = await this.tmpUserAddService.createTmpUser(data);
        console.log(user);
    }

    
    @Patch('makeFriendship')
    async makeFriendship(@Body() {userId1, userId2}: {userId1: string, userId2: string}){
        const user1 = await this.tmpUserAddService.getTmpUser( {where:{id: userId1}});
        const user2 = await this.tmpUserAddService.getTmpUser({where: {id: userId2}});

        try{
            const [user1Friends, user2Friends] = await this.tmpUserAddService.makeFriendship(user1, user2);
        }
        catch (e){
            console.log("error: ", e);
            throw new HttpException("user have ths friend", HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('blockUser')
    async blockUser(@Body() {userId1, userId2}: {userId1: string, userId2: string}){
        const user1 = await this.tmpUserAddService.getTmpUser( {where:{id: userId1}});
        const user2 = await this.tmpUserAddService.getTmpUser({where: {id: userId2}});

        try{
            const [user1Friends, user2Friends] = await this.tmpUserAddService.blockUser(user1, user2);
        }
        catch (e){
            console.log("error: ", e);
            throw new HttpException("some block error", HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('removeFriendship')
    async removeFriendship(@Body() {id, username}: {id: string, username: string}){
        const user1 = await this.tmpUserAddService.getTmpUser({where: {username: username}});
        const user  = await this.tmpUserAddService.getTmpUser({where:{id: id}});

        try{
            // console.log(user1, user);
            const [user1Friends, user2Friends] = await this.tmpUserAddService.removeFriendship(user, user1);
            // console.log(user1Friends, user2Friends);
        }
        catch{
            throw new HttpException("user don't have ths friend", HttpStatus.BAD_REQUEST);
        }

    }

    @Get('getAllUsers')
    async getAllUsers(){
        return (await this.tmpUserAddService.getAllUsers());
    }


    // this is just for test next move it to a separate file

    @Post('startDM')
    async startDM(@Body() stratDmInfo:StratDMDto){
        await this.prismaChatService.createNewDM(stratDmInfo.userId, stratDmInfo.userId2);
    }
}
