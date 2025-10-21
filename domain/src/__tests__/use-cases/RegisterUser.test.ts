import { RegisterUser } from '../../use-cases/RegisterUser';
import { User, UserRole } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IPasswordService } from '../../services/IPasswordService';

describe('RegisterUser Use Case', () => {
  let mockUserRepository: IUserRepository;
  let mockPasswordService: IPasswordService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    mockPasswordService = {
      hash: jest.fn().mockResolvedValue('hashed_password'),
      compare: jest.fn(),
    };
  });

  it('should register a new user with MEMBER role by default', async () => {
    // Arrange
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    const registerUser = new RegisterUser(mockUserRepository, mockPasswordService);
    const input = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    };

    // Act
    const result = await registerUser.execute(input);

    // Assert
    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(input.name);
    expect(result.role).toBe(UserRole.MEMBER);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordService.hash).toHaveBeenCalledWith(input.password);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw an error if email is already in use', async () => {
    // Arrange
    const existingUser = new User({
      id: '1',
      name: 'Test User',
      email: 'jane.doe@example.com',
      passwordHash: 'hashed_password',
      role: UserRole.MEMBER,
    });
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);
    const registerUser = new RegisterUser(mockUserRepository, mockPasswordService);
    const input = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
    };

    // Act & Assert
    await expect(registerUser.execute(input)).rejects.toThrow('Email already in use');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
