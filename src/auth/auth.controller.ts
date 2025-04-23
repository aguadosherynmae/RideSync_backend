import { Controller, Post, Body, Param, Put, ParseIntPipe, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsernameDto } from './dto/update_username.dto';
import { EmailDto } from './dto/update_email.dto';
import { PasswordDto } from './dto/update_pass.dto';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Put("updateUser/:id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() usernameDto: UsernameDto
  ) {
    return this.authService.updateUser(id, usernameDto);
  }
  @Put("updateEmail/:id")
  async updateEmail(
    @Param("id", ParseIntPipe) id: number,
    @Body() emailDto: EmailDto
  ) {
    return this.authService.updateEmail(id, emailDto);
  }
  @Put("updatePassword/:id")
  async updatePassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() passwordDto: PasswordDto
  ) {
    return this.authService.updatePassword(id, passwordDto);
  }
}

