import { Body, Controller, Get, Inject, Param, Patch, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../Auth/auth_google/utils/jwt.guard";
import { UserService } from "./user.service";
import { ConfirmUserDto } from "./dto/confirm.dto";
import { AuthGoogleService } from "../../Auth/auth_google/auth_google.service";
import { Request, Response } from 'express';
import { asyncScheduler } from "rxjs";
import { profile } from "console";

@Controller('user')
export class UserController {
    constructor(private userService: UserService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
    ) { }



    // @UseGuards(JwtGuard)
    // @Get(":id")
    // async getUserProfile(@Param("id") id: string)
    // {
    //     return await this.userService.findById(id);
    // }


  @Patch('confirm')
  @UseGuards(JwtGuard)
  async confirm(@Req() req: Request, @Res() res: Response, @Body() dto: ConfirmUserDto) {
    try {
      const user = await this.authGoogleService.check_token(req);
      if (!user) {
        throw new UnauthorizedException();
      }
      const confirm = await this.userService.confirm(user.email, dto);
      res.status(200).json({ message: 'User confirmed successfully', result: confirm });
    } catch (error) {
      res.status(500).json({ message: 'Error finding user' });
    }
  }
    
    
  @Get('profile')
  @UseGuards(JwtGuard)
  async check(@Req() req: Request, @Res() res: Response)
  {
    console.log("heeeeeeere");
    try {
      const user = await this.authGoogleService.check_token(req);
      console.log("user   ==>", user);
      if (!user) {
        throw new UnauthorizedException();
      }
      res.status(200).send(user);
    } catch (error)
    {
          res.status(500).json({ message: 'Error finding user' });
    }
  }


  @Get('all')
  // @UseGuards(JwtGuard)
  async all(@Req() req: Request, @Res() res: Response)
  {
    console.log("heeeeeeere");
    const users = await this.userService.allUsers();
    res.status(200).send(users);
    // return users
  }
  

  @Get('friends')
  @UseGuards(JwtGuard)
  async allfriend(@Req() req: Request, @Res() res: Response)
  {
    // const friends = await this.userService.allFriend(req);
  }
}
