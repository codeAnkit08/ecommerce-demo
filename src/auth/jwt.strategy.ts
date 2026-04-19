import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!,
        });
    }

    async validate(payload: { sub: string }) {
        const user = await this.usersService.getUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // 🔥 remove sensitive fields
        const { password, ...safeUser } = user;

        return safeUser;
    }
}