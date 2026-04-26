import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { LoginDto } from "src/users/dtos/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    console.log('Received registration request:', dto);
    const data = this.authService.register(dto);
    return {
      success: true,
      data,
      message: "User Created Successfully"
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('Received login request:', dto);
    const data = await this.authService.login(dto);
    return {
      success: true,
      data,
      message: "Login successful"
    }
  }
}