import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserAlreadyExistsError } from 'src/core/errors/auth';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginBodyDto } from './dto/login-body.dto';
import { AuthRequiredGuard } from 'src/core/guards/auth-required.guard';
import { RequestService } from 'src/core/request.service';
import { UsersService } from 'src/users/users.service';
import { ValidationPipe } from 'src/core/pipes/validation.pipe';
import { ChangeThemeDto } from './dto/change-theme.dto';
import { User } from 'src/core/decorators/user.decorator';
import { IUser } from 'src/users/user.schema';
import { ChangeTLangDto } from './dto/change-lang.dto';

@Controller('/api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/auth/register')
  async register(@Body(ValidationPipe) body: CreateUserDto) {
    const alreadyExists = await this.usersService.userWithUsernameExists(
      body.username,
    );

    if (alreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const createdUser = await this.usersService.createUserAndReturn(body);

    const accessToken = this.authService.generateAccessToken({
      userId: createdUser._id,
    });

    return { user: createdUser, accessToken };
  }

  @Patch('/auth/change-theme')
  @UseGuards(AuthRequiredGuard)
  async changeTheme(
    @Body(ValidationPipe) body: ChangeThemeDto,
    @User() user: IUser,
  ) {
    await this.usersService.changeThemeOfUser({
      userId: user._id,
      to: body.theme as any,
    });

    return { changed: true };
  }

  @Patch('/auth/change-lang')
  @UseGuards(AuthRequiredGuard)
  async changeLang(
    @Body(ValidationPipe) body: ChangeTLangDto,
    @User() user: IUser,
  ) {
    await this.usersService.changeLangOfUser({
      userId: user._id,
      to: body.lang as any,
    });

    return { changed: true };
  }

  @Post('/auth/login')
  async login(@Body(ValidationPipe) body: LoginBodyDto) {
    const user = await this.usersService.getUserByUsernameOrFailIfNotFound(
      body.username,
    );

    await this.usersService.checkIfPasswordMatchesOrFail(
      user._id,
      body.password,
    );

    const accessToken = this.authService.generateAccessToken({
      userId: user._id,
    });

    return { user, accessToken };
  }
}
