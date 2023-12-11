import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma } from "@prisma/client";
import { User } from "src/types/types";
import { WsException } from "@nestjs/websockets";
// import { PrismaClient } from '@prisma/client';

@Injectable()
export class TmpUserService{
    constructor(private readonly prisma: PrismaService){}

    // async createTmpUser(data: Prisma.tmpUserCreateInput){
    //     return this.prisma.tmpUser.create({data});
    // }

    async createTmpUser(data :Prisma.UserCreateInput){
        return (await this.prisma.user.create({data}))
    }
    async getTmpUser(params: Prisma.UserFindUniqueArgs){
        return (await this.prisma.user.findUnique(params))
    }

    async makeFriendship(user1:User, user2:User){

        const user = await this.prisma.user.findUnique({
            where: { id: user1.id },
            include: {
              friends: true,
              blockedUsers: true,
              blockedByUsers: true,
            },
          });

        // handle the bocked/blockedby situations

        const hasFriendship = user.friends.some((friend)=> friend.id === user2.id);
        if (hasFriendship) throw new WsException('Friendship already exists')

        // const hasBlocked = user.blockedUsers.some((user)=> user.userblockedId == user2.id);
        // if (hasBlocked) throw new WsException('you blocked this user')

        // const isBlocked = user.blockedByUsers.some((user)=> user.userblockedById == user2.id);
        // if (isBlocked) throw new WsException('this user has blocked you')


        const [user1Friends, user2Friends] = await Promise.all([

            (this.prisma.user.update({
                where: {
                    id: user1.id,
                },
                data: {
                    friends: {
                        connect:{id:user2.id}
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data:{
                    friends:{
                        connect:{id:user1.id}
                    }
                }
            })
        ])

        return [user1Friends, user2Friends];
    }

    async blockUser(user1:User, user2:User){

        // const block = await this.prisma.block.create({
        //     data: {
        //       userblockedId: user2.id,
        //       userblockedById: user1.id,
        //     }})
        await this.prisma.user.update({
            where: {
                id: user1.id,
            },
            data: {
                blockedUsers:{connect:{id:user2.id}}
            }
        })

        return [user1, user2];
    }

    async deleteTmpUser(params: Prisma.UserDeleteArgs){
        return (await this.prisma.user.delete(params))
    }

    async deleteAllTmpUsers(){
        return (await this.prisma.user.deleteMany())
    }

    async removeFriendship(user1:User, user2:User){

        // const hasFriendship = await this.getTmpUser({where:{id: user1.id, friends:{has:user2.id}}})

        // thorw exeption if friendship does not exist and set status code to 404
        // console.log("user has friendship:",hasFriendship);
        // if (!hasFriendship) throw new WsException('Friendship does not exist')
        const [user1Friends, user2Friends] = await Promise.all([

            (this.prisma.user.update({
                where: {
                    id: user1.id,
                    },

                data: {
                    friends: {
                        // set: user1.friends.filter((friend) => friend !== user2.id), 
                    }
                }
            })),
            this.prisma.user.update({
                where: {
                    id: user2.id,
                },
                data:{
                    friends:{
                        // set: user2.friends.filter((friend) => friend !== user1.id),
                    }
                }
            })
        ])
        return [user1Friends, user2Friends];
    }

    async getAllUsers(){
        return (await this.prisma.user.findMany({include:{userDMs:true}}))
    }
}