import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
export interface JwtPayload {
    sub: string;
    email: string;
}
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    generateToken(user: User): Promise<string>;
    verifyToken(token: string): Promise<JwtPayload>;
}
