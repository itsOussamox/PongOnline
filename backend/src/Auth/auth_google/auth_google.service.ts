import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { use } from "passport";
// import { PrismaService } from "src/prisma.service";
// import { UserDtetails } from "src/utils/types";
import { Response, Request } from 'express';
// import { UserService } from "src/user/user.service";
// import { LoginDto } from "src/user/dto/auth.dto";
import * as bcrypt from 'bcrypt';
// import { PrismaService } from "backAuth/src/prisma.service";
import { UserService } from "../../profile/user/user.service";
import { LoginDto } from "../../profile/user/dto/auth.dto";
import { UserDtetails } from "src/types/types";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
const speakeasy = require('speakeasy');

@Injectable()
export class AuthGoogleService {

    constructor (private readonly prisma: PrismaService,
                private readonly jwtService: JwtService,
                private readonly userService: UserService){}


async login(dto:LoginDto)
{
  console.log("-----");
  console.log(dto);
  console.log("----");
    const user = await this.validateUserlogin(dto);
    const payload = {
        email: user.email,
        sub: user.username,
    };
    const backendTokens = await this.generateJwt(payload)
    return {
        user, 
        backendTokens
    }
}

async validateUserlogin(dto:LoginDto)
{
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await bcrypt.compare(dto.hash, user.hash)))
    {
        const { hash, ...result} = user;
        return result;
    }
    throw new UnauthorizedException();
}

  async validateUser(details: UserDtetails)
  {
    const user = await this.prisma.user.findUnique({
      where: {
        email: details.email,
      },
    });
  
    if (user) {
      return user;
    }
    console.log('User not found.');
    console.log(details.username);
    const tempSecret =  speakeasy.generateSecret()
    const newUser = await this.prisma.user.create({
      data: {
        email: details.email,
        username: details.username,
        hash : '',
        title: 'snouae rfa3 ta7di',
        wallet:10,
        TwoFactSecret: tempSecret.base32,
        profilePic: details.profilePic.toString()
      },
      
    });
    return newUser;
  }
    async findUser(id: string)
    {
        const user = await  this.prisma.user.findUnique({
            where : {
                id : id,
            },
        })
        return (user);
    }

    async findUserByEmail(email: string)
    {
        const user = await  this.prisma.user.findUnique({
            where : {
                email : email,
            },
        })
        if (!user)
          return null;
        return (user);
    }

    async generateJwt(payload) {
      return {
        backendTokens: {
           accessToken: await this.jwtService.signAsync(payload, {
               expiresIn: '1h',
               secret: process.env.jwtSecretKey ,
           }),
           refreshToken: await this.jwtService.signAsync(payload, {
               expiresIn: '7d',
               secret: process.env.jwtRefreshToken ,
           }),
        }
      
  }
}


 extractTokenFromHeader(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  console.log(token);
  return token ;
}
  

  async check_token(req: Request) {
  let payload;
  try {
    const token = this.extractTokenFromHeader(req);
    payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.jwtSecretKey,
    });
    console.log('Payload:', payload); 
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }

  if (!payload || !payload.email) {
    console.error('Invalid payload structure');
    return null;
  }

  const user = await this.findUserByEmail(payload.email);
  if (!user) {
    console.error('User not found for email:', payload.email);
    return null;
  }

  return user;
}

}

