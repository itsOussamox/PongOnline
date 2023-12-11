import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthGoogleService } from '../auth_google.service';
import {Response} from 'express';
// import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    //super() is calling the constructor of the superclass, which is PassportStrategy in this context
    constructor(
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
      ){
        super({
            clientID:
                '1036525550588-efro8tfrk1fc4df8vk8k6lm1pqh7g5aq.apps.googleusercontent.com',
            clientSecret:
                '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',
          callbackURL: 'http://localhost:3001/api/auth/google/redirect',
          //  callbackURL: 'http://localhost:3001/api/auth/google/redirect',
            scope: ['profile', 'email'],
        });
    }
    /*validate Method:

The validate method is called by Passport.js after successful authentication to validate and process
 the user's profile information. 
This method is part of the strategy and is called automatically by Passport.js. */
    async validate(accessToken: string, refreshToken : string, profile: Profile, res: Response)
    {
        console.log(profile);
      const user = await  this.authGoogleService.validateUser({
            email: profile.emails[0].value,
          username: profile.displayName,
          profilePic: profile._json.picture,
        });
        console.log('validate')
        // const user = authenticationResult.user || authenticationResult.newUser || null;
        // if (user) {
        //     const { accessToken, refreshToken } = authenticationResult.backendTokens;
        //     // res.cookie('access_token', accessToken, {httpOnly: true});
        //     // res.cookie('refresh_token', refreshToken, {httpOnly:  true });
        //     res.setHeader('access_token', accessToken);
        //     res.setHeader('refresh_token', refreshToken);
        //     console.log('access_token:');
        //     console.log(accessToken);
        //     console.log('refresh token :')
        //     console.log(refreshToken);
        //   }
        console.log(user);
        return (user);
        // done(null, user);
    }
}


//validate is executed by Passport.js middleware during the authentication flow.
/*
Strategy Initialization:

The GoogleStrategy is initialized during the application startup.
Strategy options, such as client ID, client secret, callback URL, etc., are configured in the constructor.
Authentication Request:

When a user initiates an authentication request (e.g., logs in with Google), Passport.js intercepts the request.
authenticate Method:

Passport.js middleware calls the authenticate method of the strategy.
In the authenticate method, you define how to handle the authentication process.
For example, you might redirect the user to an external authentication provider (Google) for login.
External Authentication:

The user interacts with the external authentication provider (e.g., Google) to log in.
After successful authentication, the provider redirects the user back to your application with authentication details.
validate Method:

Passport.js calls the validate method after receiving the authentication details.
In the validate method, you define how to handle the user's profile information obtained from the external provider.
This may involve logging the information, creating or retrieving a user in your database, and setting up the user's session or issuing a token.
Success or Failure:

Depending on the outcome of the validate method, Passport.js either considers the user authenticated and proceeds with the request or fails the authentication.
If successful, the user is typically granted access to protected routes or resources.
 */