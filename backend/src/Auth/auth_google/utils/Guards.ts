import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
//'google' is the strategy name and should match the strategy name and it has be matched when confuguring the googleStretegy
export class GoogleAuthGuard extends AuthGuard('google')
{
   // canActivate method: Overrides the canActivate method from the parent class. 
    // async canActivate(context: ExecutionContext)
    // {
    //     //This checks whether the authentication is successful.
    //     const activate = (await super.canActivate(context)) as boolean;
    //     // Obtains the request object from the current execution context.
    //     const request = context.switchToHttp().getRequest();
    //     //this  method for establishing a login session.
    //     await super.logIn(request);
    //     return activate;
    // }
    //and all of this just for ensuring that only authenticated users with a successful 
    //Google OAuth authentication are allowed to access those routes.
    // You can apply this guard by adding 
}
/*
AuthGuard('google'):

AuthGuard is a built-in Nest.js guard provided by @nestjs/passport.
AuthGuard('google') specifies that this guard should use the 'google' strategy internally.
 This strategy is assumed to be defined elsewhere in your application.
canActivate Method:

The canActivate method overrides the method from the parent class (AuthGuard).
It checks whether the authentication is successful using the specified strategy ('google').
If successful, it continues with the request processing.
Login Session:

The method then obtains the request object and uses super.logIn(request) to establish a 
login session. This is a part of Passport.js functionality for managing user sessions.
Route Access Control:

The guard is designed to ensure that only authenticated users with a successful Google OAuth authentication 
are allowed to access the routes where this guard is applied.
When you use @UseGuards(GoogleAuthGuard) on a route or controller method, 
it means that the authentication process, including the 'google' strategy, is applied before the route handler is invoked
 */