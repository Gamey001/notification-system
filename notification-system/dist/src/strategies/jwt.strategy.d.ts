import { UserService } from "../services/user.service";
import { JwtPayload } from "../services/auth.service";
import { ConfigService } from "@nestjs/config";
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    private configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<import("../entities/user.entity").User>;
}
export {};
