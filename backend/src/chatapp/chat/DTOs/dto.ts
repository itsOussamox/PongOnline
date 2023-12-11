import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { user } from '../types/user';

export class userDataDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsBoolean()
    isAdmin: Boolean = false;

}

export class messageDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    from?: string;

    @IsString()
    @IsNotEmpty()
    event?: string;
}

export class CreateChannelDto{
    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsNotEmpty()
    @IsString()
    password?: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    admines?: string[]

    @IsNotEmpty()
    @IsString()
    creator: string


    @IsNotEmpty()
    members?: user[]
}

export class ChangeChannelDataDto{
    @IsNotEmpty()
    @IsString()
    channelName: string;
    
    @IsNotEmpty()
    @IsString()
    password?: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    channelId: string;
    
    @IsNotEmpty()
    @IsString()
    userId: string

    removeAdmins?: user[];
    addAdmins?: user[];
}

export class JoinChannelDto{
    @IsNotEmpty()
    @IsString()
    channelId: string;

    @IsNotEmpty()
    @IsString()
    password?: string;

    @IsNotEmpty()
    @IsString()
    userId:string;
}

// export class channelDeleteDto{
//     @IsNotEmpty()
//     @IsString()
//     channelId:string;

//     @IsNotEmpty()
//     @IsString()
//     userId:string;
// }

// export class RemoveUserFromChannelDto{
//     @IsNotEmpty()
//     @IsString()
//     channelId:string;

//     @IsNotEmpty()
//     @IsString()
//     userId:string;

//     @IsNotEmpty()
//     @IsString()
//     userToRemove:string;
// }

export class ChannelEditDto{
    @IsNotEmpty()
    @IsString()
    channelId:string;

    @IsNotEmpty()
    @IsString()
    userId:string;

    @IsNotEmpty()
    @IsString()
    userId2?:string;
}


































