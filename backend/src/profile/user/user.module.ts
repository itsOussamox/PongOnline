import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtGuard } from "../../Auth/auth_google/utils/jwt.guard";
import { AuthGoogleService } from "../../Auth/auth_google/auth_google.service";
import { AuthGoogleController } from "../../Auth/auth_google/auth_google.controller";
import { IntraStrategy } from "../../Auth/auth_google/utils/IntraStrategy";
import { GoogleStrategy } from "../../Auth/auth_google/utils/GoogleStrategy";
import { PrismaService } from "src/chatapp/prisma/prisma.service";
// import { PrismaService } from "backAuth/src/prisma.service";

@Module({
    providers: [ PrismaService,JwtService, UserService, GoogleStrategy,
        // SessionSerializer, AuthGoogleService, 
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthGoogleService,
        } ,PrismaService, 
      //  JwtService,
        IntraStrategy,
    UserService],

    controllers: [UserController, AuthGoogleController,
    ],
})

export class UserModule {}