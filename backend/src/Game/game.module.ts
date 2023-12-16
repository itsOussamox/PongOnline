import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthGoogleService } from 'src/Auth/auth_google/auth_google.service';
import { PrismaService } from 'src/chatapp/prisma/prisma.service';
import { UserModule } from 'src/profile/user/user.module';
import { UserService } from 'src/profile/user/user.service';
import { MatchmakingGateway } from './matchmaking.gateway';
// import { UserModule } from 'src/profile/user/user.module';
// import { UserService } from 'src/profile/user/user.service';

@Module({
  imports: [UserModule],
  providers: [GameService, GameGateway, MatchmakingGateway, JwtService,  // SessionSerializer,
  {
      provide: 'AUTH_SERVICE',
      useClass: AuthGoogleService,
  }, PrismaService, UserService] ,
})
export class GameModule {}
