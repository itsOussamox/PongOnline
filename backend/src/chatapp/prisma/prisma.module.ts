import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TmpUserService } from './tmpUserAdd.service';

@Module({

  imports: [PrismaModule],
  providers: [PrismaService, TmpUserService],
  exports: [PrismaService, TmpUserService]
})
export class PrismaModule {}
