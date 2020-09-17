import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNumber()
    age: number;
}