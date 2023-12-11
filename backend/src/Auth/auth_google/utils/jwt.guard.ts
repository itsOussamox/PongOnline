import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { AuthGoogleService } from "../auth_google.service";

@Injectable()
export class JwtGuard implements CanActivate{
    constructor (private readonly jwtService: JwtService,
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService){}
    async canActivate(context: ExecutionContext): Promise<boolean>{



        // console.log("----------------------------------------------------------");
        const request =  context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret : process.env.jwtSecretKey,
            });
            const user = await this.authGoogleService.findUserByEmail(payload.email);
            if (!user)
                throw new UnauthorizedException();
            request['user'] = user;
        }
        catch {
            throw new UnauthorizedException();
        }
        return true;

    }
    // private extractTokenFromHeader(request: Request) {
    //     const[type, token] = request.headers.authorization.split(' ') ?? [];
    //     return type === 'Bearer' ? token : undefined;
    // }

    private extractTokenFromHeader (req: Request){
        // console.log(req);
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        console.log(token);
        return token ;
      }
}