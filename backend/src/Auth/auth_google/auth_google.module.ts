import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth_google.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
// import { PrismaService } from 'src/prisma.service';
import { AuthGoogleService } from './auth_google.service';
import { JwtService } from '@nestjs/jwt';
import { IntraStrategy } from './utils/IntraStrategy';
// import { PrismaService } from 'backAuth/src/prisma.service';
import { UserService } from '../../profile/user/user.service';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
// import { UserService } from 'src/user/user.service';
// import { SessionSerializer } from './utils/Serializer';



//Middleware Usage:
//when a request is made to a route protected by the GoogleStrategy (e.g., AuthGoogleController),
// Nest.js middleware, provided by Passport.js, intercepts the request.
@Module({
    controllers: [AuthGoogleController],
    providers: [GoogleStrategy,
            // SessionSerializer,
            {
                provide: 'AUTH_SERVICE',
                useClass: AuthGoogleService,
            } ,PrismaService, 
            JwtService,
            IntraStrategy,
        UserService  ],
})
export class AuthGoogleModule {}
