import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { IPasswordService } from '../services/IPasswordService';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

export class AuthenticateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute({ email, password }: AuthenticateUserInput): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordsMatch = await this.passwordService.compare(
      password,
      user.passwordHash
    );

    if (!passwordsMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
