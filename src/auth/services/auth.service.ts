import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersEntity } from 'src/users/entities/users.entity';
import { PayloadToken } from '../interfaces/auth.interface';
import { ROLES } from 'src/constants/roles';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService
    ) {}
    public async validateUser(username: string, password: string){

        const userbyUsername = await this.userService.findBy({
            key: 'username',
            value: username
        });
        const userbyEmail = await this.userService.findBy({
            key: 'email',
            value: username
        });

        if (userbyUsername){
            const match = await bcrypt.compare(password, userbyUsername.password);
            if (match) {
                return userbyUsername;
            }
        }

        if (userbyEmail){
            const match = await bcrypt.compare(password, userbyEmail.password);
            if (match) {
                return userbyEmail;
            }
        }

    }

    public signJWT({
        payload, 
        secret, 
        expires,

    }:{
        payload: jwt.JwtPayload | string; 
        secret: any; 
        expires: jwt.SignOptions['expiresIn'];
    }){
        return jwt.sign(payload, secret, {expiresIn: expires});
    }

    public async generateJWT(user: UsersEntity): Promise<any>{
        const getUser = await this.userService.findUserById(user.id);
        
        const payload: PayloadToken = {
            role: getUser.roles,
            sub: getUser.id
        }

         return {
            accessToken: this.signJWT({
                payload,
                secret: process.env.JWT_SECRET,
                expires: '1h',
            }),
            user,
         };
    }
}
