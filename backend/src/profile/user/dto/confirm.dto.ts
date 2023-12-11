import { IsEmail, IsString } from "class-validator";


export class ConfirmUserDto{
    @IsString()
    username: string;

     @IsString()
    profilePic: string;

    @IsString()
    hash: string;
}