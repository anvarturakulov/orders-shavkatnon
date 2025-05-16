import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AuthService } from './auth.service';

// @ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
    
    @Post('/login')
    login(@Body('initData') initData: string) {
        console.log('Received initData:', initData); // Для отладки
        if (!initData) {
        throw new HttpException('initData is missing', HttpStatus.BAD_REQUEST);
        }
        return this.authService.login(initData)
    }


  
}
