import { User, UserRole } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { IPasswordService } from '../services/IPasswordService';
import { v4 as uuidv4 } from 'uuid';

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute({ name, email, password }: RegisterUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const passwordHash = await this.passwordService.hash(password);

    const user = new User({
      id: uuidv4(),
      name,
      email,
      passwordHash,
      role: UserRole.MEMBER, // Default role
    });

    await this.userRepository.save(user);

    return user;
  }
}
