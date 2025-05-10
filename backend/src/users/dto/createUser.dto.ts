import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEmail, Length, IsEnum} from 'class-validator';
import { UserRoles } from "src/interfaces/user.interface";

export class CreateUserDto {
    @ApiProperty({example:'user@mail.ru', description: 'Почтовый адрес'})
    @IsString({message: 'email - должно быть строкой'})
    @IsEmail({}, {message: 'Не корректный email'})
    readonly email: string;

    @ApiProperty({example:'12345678', description: 'Пароль'})
    @IsString({message: 'password - должно быть строкой'})
    @Length(4, 50, {message: 'password - не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({example:'Анвар', description: 'Имя'})
    @IsString({message: 'name - должно быть строкой'})
    @Length(4, 50, {message: 'name - не меньше 4 и не больше 16'})
    readonly name: string;

    @ApiProperty({example:'USER ROLE', description: 'Роль'})
    @IsString({message: 'role - должен быть строкой'})
    @IsEnum(UserRoles, {message: 'role - должен быть из списка ролей'})
    readonly role: UserRoles;

}