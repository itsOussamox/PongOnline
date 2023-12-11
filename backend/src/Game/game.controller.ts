import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtGuard } from "../Auth/auth_google/utils/jwt.guard";
import { UseGuards } from '@nestjs/common';


@Controller('/game')
export class GameController {
    constructor(private readonly gameService: GameService) {}
    @UseGuards(JwtGuard)
    
    @Get()
    getGame(): string {
        
        return 'Game';
    }
}
