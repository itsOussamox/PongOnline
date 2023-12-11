import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthGoogleService } from '../auth_google.service';
import {Response} from 'express';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authGoogleService: AuthGoogleService,
      ){
        super({
            clientID:
                'u-s4t2ud-ae38f95888699e53a0d1e83d0112945b049d14a0d11d467ebb5d373db96cd2be',
            clientSecret:
                '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',
            callbackURL: 'http://localhost:3001/api/auth/google/redirect42',
            // scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken : string, profile: Profile, res: Response)
    {

      console.log(profile);
      const user = await  this.authGoogleService.validateUser({
        email: profile.emails[0].value,
          username: profile._json.login,
            profilePic: profile._json.image.link,
        });
        // console.log(profile);   
        console.log('validate')
         return (user);
    }
}