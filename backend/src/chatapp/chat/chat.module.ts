import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
// import { PrismaChatService } from 'chatapp/server_chatapp/prisma/chat/prisma.chat.service';
// import { PrismaModule } from 'chatapp/server_chatapp/prisma/prisma.module';
import { ChannelController } from './chat.channel.controller';
import { GatewayService } from './chat.gateway.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaChatService } from '../prisma/chat/prisma.chat.service';

@Module({
  imports:[PrismaModule],
  controllers:[ChannelController],
  providers: [ChatGateway, PrismaChatService, GatewayService]
})

export class ChatModule {}
