import { Body, Controller, Get, HttpStatus, Inject, Post, Redirect, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthGuard } from "./utils/Guards";
import { AuthGuard } from '@nestjs/passport';
import { AuthGoogleService } from "./auth_google.service";
import { JwtGuard } from "./utils/jwt.guard";
import { IntraAuthGuard } from "./utils/IntraGuard";
// import { UserService } from "src/user/user.service";
// import { CreateUserDto } from "src/user/dto/user.dto";
// import { LoginDto } from "src/user/dto/auth.dto";
import * as qrcode from 'qrcode';
import { use } from "passport";
import { UserService } from "../../profile/user/user.service";
import { CreateUserDto } from "../../profile/user/dto/user.dto";
import { LoginDto } from "../../profile/user/dto/auth.dto";
const speakeasy = require('speakeasy');



@Controller('auth')
export class AuthGoogleController
{
    //npm i @nestjs/passport passport passport-google-oauth20
    // @nestjs/passport provides decorators and utilities to simplify the integration of Passport.js with Nest.js and it's a module
    //This is the core Passport.js library. Passport is a middleware that simplifies the process of implementing authentication in a Node.js application.
    // It supports various authentication strategies, such as local username/password, OAuth, and others.
    //passport-google-oauth20: This is a Passport.js strategy for authenticating with Google using the OAuth 2.0 protocol. 
    //It allows you to enable Google as an authentication provider in your application,
    //letting users log in with their Google credentials.
    //npm i -D @types/passport-google-oauth20
    // it provides TypeScript type definitions for the passport-google-oauth20 package.
    // TypeScript type definitions are used to provide static type information about the structure of the JavaScript code in a package, 
    //enabling better development tools support, such as autocompletion and type checking.
    constructor(
      @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
      private readonly userService: UserService
    ){}
    @Get('google/login')
     @UseGuards(GoogleAuthGuard)
    handleLogin()
    {
      console.log('hello');
        return {msg : 'hello man'};
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleRedirect(@Req() req: Request, @Res() res: Response)
    {
      const jwtResult = await this.authGoogleService.generateJwt(req.user);
      res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: false });
      res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: false });
      //return {msg : 'user registred'};
      return res.redirect('http://localhost:3000/confirm')
      // return res.status(HttpStatus.OK).json(req.user);
    }
    
    @Get('42/login')
    @UseGuards(IntraAuthGuard)
    handleLogin42()
    {
      
      return {msg: "42 Login"}
    }
    
        @Get('google/redirect42')
        @UseGuards(IntraAuthGuard)
        async handleRedirect42(@Req() req: Request, @Res() res: Response)
        {
            const jwtResult = await this.authGoogleService.generateJwt(req.user);
            res.cookie('access_token', jwtResult.backendTokens.accessToken, { httpOnly: false });
          res.cookie('refresh_token', jwtResult.backendTokens.refreshToken, { httpOnly: false });
          // console.log(jwtResult.backendTokens.accessToken);
            return res.redirect('http://localhost:3000/confirm')
            // return res.status(HttpStatus.OK).json(req.user);
        }




    @Get('protected')
  protectedRoute(@Req() request) {
    const accessToken = this.authGoogleService.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not provided');
    }
    // console.log('Access token:', accessToken);
    return { message: 'Protected route accessed' };
  }
  
    // const authorizationHeader = request.headers.authorization;
    // if (!authorizationHeader) {
    //   return null;
    // }
    // const [type, token] = authorizationHeader.split(' ');
    // if (type === 'Bearer' && token) {
    //   return token;
    // }
    // return null;
  //}

@Get('check')
@UseGuards(JwtGuard)
async check(@Req() req: Request, @Res() res: Response)
{
  try {
    const user = req['user'];
    console.log("user : ", user);
    if (!user) {
      throw new UnauthorizedException();
    }
    res.status(200).send(user);
  } catch (error)
  {
        res.status(500).json({ message: 'Error finding user' });
  }
}

    @Get('generate/twofac')
    // @UseGuards(JwtGuard)
    async RegisterFac(@Req() req: Request, @Res() res: Response)
    {
      try {
        const user = await this.authGoogleService.check_token(req);
        const {code} = req.body
      
        if (!user || user.TwoFactSecret === null) {
          throw new UnauthorizedException();
        }
      
        const secret  = user.TwoFactSecret;
        const verified = speakeasy.totp.verify({
          secret,
          encoding: 'base32',
          token: code,
        });
      
        if (verified) {
          res.json({ verified: true });
        } else {
          res.json({ verified: false });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error finding user' });
      }
    }
    // @Post('/verify')
    // async VerifyFac(@Req() req: Request, @Res() res: Response)
    // {
    //   const {token, userId} = req.body
    //   try
    //   {
    //     const path =`/user/${userId}`
    //     comst user = db.getData(path)
    //     const {base32:}
    //   }      
    // }


    @UseGuards(JwtGuard)
    @Get('google/test')
    getTestData() {
      return { message: 'This is a protected route for testing JWT authentication.' };
    }

    @Get('google/status')
    user(@Req() request: Request) {
      // console.log(request.user);
      // if (request.user) {
      //   return { msg: 'Authenticated' };
      // } else {
      //   return { msg: 'Not Authenticated' };
      // }
      // // const[type, token] = request.headers.authorization.split(' ') ?? [];
      //     console.log(token);
    
    return { msg: 'Authenticated', user: request.user };
    }


  @Get('generate')
  async generateTwoFactorAuthQR(@Req() req, @Res() res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (user.isTwoFactorAuthenticationEnabled) {
      return res.status(400).json({ message: '2FA already enabled!' });
    }

    const secret = user.TwoFactSecret;
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret,
      label: `YourApp:${user.username}`,
      issuer: 'YourApp',
    });

    const qrCodeDataURL = await qrcode.toDataURL(otpAuthUrl);

    return res.status(200).json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({ message: 'Error generating QR code' });
  }
}



    @Post('register')
    async registerUser(@Body() dto:CreateUserDto)
    {
        return await this.userService.create(dto);
    }

    @Post('login')
    async login(@Body() dto:LoginDto,@Req() req: Request, @Res() res: Response)
    {
      try
      {
        const data = await this.authGoogleService.login(dto);
        res.cookie('access_token', data.backendTokens.backendTokens.accessToken, { httpOnly: false });
        res.cookie('refresh_token', data.backendTokens.backendTokens.refreshToken, { httpOnly: false });
        res.json(data);
      }
      catch (error)
      {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}