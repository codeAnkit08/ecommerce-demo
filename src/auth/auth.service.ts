import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "src/users/dtos/login.dto";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    console.log('Registering user:', dto);
    const existing = await this.usersService.getUserByEmail(dto.email);
    if (existing) {
        throw new BadRequestException('User already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      ...dto,
      password: hashed,
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto):Promise<{ user: User, token: any }> {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) throw new BadRequestException('Invalid credentials');
    
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token: this.generateToken(user) };
  }

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}