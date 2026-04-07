import { ROLES } from "src/constants/roles";
import { UsersEntity } from "src/users/entities/users.entity";

export interface PayloadToken {
    role: ROLES;
    sub: string;
}

export interface AuthBody{
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: UsersEntity;
}

export interface AuthTokenResult {
    role: string;
    sub:  string;
    iat:  number;
    exp:  number;
}

export interface IUseToken {
    role: string;
    sub:  string; 
    isExpired: boolean;   
}
