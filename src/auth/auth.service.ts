import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { SignUpCredentialsDto, SignInCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) { }

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(signUpCredentialsDto);
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<string> {
    const { username, password } = signInCredentialsDto;

    const user = await this.usersRepository.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      return 'success';
    } else {
      throw new UnauthorizedException('Email or password incorrect');
    }
  }
}
