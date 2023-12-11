import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { ConfirmUserDto } from './dto/confirm.dto';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
// import { PrismaService } from 'backAuth/src/prisma.service';

@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService){}
    async create(dto: CreateUserDto)
    {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (user)
            throw new ConflictException('email duplicated');
            const newUser = await this.prisma.user.create({
                data:{
                    ...dto,
                    hash: await bcrypt.hash(dto.hash, 10),
                    title: "snouae rfa3 ta7di",
                    profilePic: "https://i.imgur.com/GJvG1b.png",
                    wallet:10,
                },
            });
        const {hash, ...result} = newUser;
        return result;
    }
    
    async findByEmail(email: string) 
    {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
    
    async findById(id: string) 
    {
        return await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    async allUsers()
    {
        const users = await this.prisma.user.findMany({
        select: {
            id: true,
            username: true,
        },
        });
        return users;
    }



    async confirm(email: string, dto: ConfirmUserDto)
    {

        const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
        });

        if (existingUser && existingUser.email !== email) {
        throw new ConflictException(`Username ${dto.username} already exists`);
        }
            const user = await this.prisma.user.update({
                where: { email: email },
                data: {
                    ...dto,
                    hash: await bcrypt.hash(dto.hash, 10)
                },
                })
    }
}