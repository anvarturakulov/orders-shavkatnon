import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';
import { UserLoginDto } from 'src/users/dto/userLogin.dto';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService){}
    
    private verifyInitData(initData: string, botToken: string): boolean {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        params.delete('hash');
        const dataCheckString = Array.from(params.entries())
        .sort()
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
        const secretKey = createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();
        const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');
        return calculatedHash === hash;
    }

    async login(initData : string) {

        try {
            if (!initData) {
                throw new Error('initData is missing');
            }
            const botToken = process.env.BOT_TOKEN_MINIAPP ? process.env.BOT_TOKEN_MINIAPP : ''
            // console.log('botToken --', botToken)
            const isValid = this.verifyInitData(initData, botToken);
            if (!isValid) {
                throw new Error('Invalid initData');
            }
    
            const params = new URLSearchParams(initData);
            const userFromInitData = JSON.parse(params.get('user') || '{}');
            const user = await this.userService.getUserByTelegramId(userFromInitData?.id)

            if ( user ) {
                const {email, role, name, sectionId, id} = user
                
                let {token} = await this.generateToken(user)
                
                if (user.banned) {
                    throw new HttpException('Пользователь заблокирован', HttpStatus.FORBIDDEN)
                } 
                return {
                    id,
                    email,
                    role,
                    token,
                    name,
                    sectionId
                }
            }
            throw new UnauthorizedException({ message: 'Некорректный email или пароль' })
            
        } catch (error) {
            console.error('Verification error:', error.message);
            throw new HttpException(`Verification failed: ${error.message}`, HttpStatus.BAD_REQUEST);
        }

        
    }
    
    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id,}
        return {
            token: this.jwtService.sign(payload)
        }
    }

}
