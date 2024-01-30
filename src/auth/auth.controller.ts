import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() params: LoginDto) {
    return this.authService.login(params);
  }

  @Post('/signup')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  signup(@Body() params: SignupDto) {
    return this.authService.signUp(params);
  }
}
