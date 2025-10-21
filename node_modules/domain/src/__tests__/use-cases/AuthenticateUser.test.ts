import { AuthenticateUser } from '../../use-cases/AuthenticateUser';
import { User, UserRole } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IPasswordService } from '../../services/IPasswordService';

describe('AuthenticateUser Use Case', () => {
  let mockUserRepository: IUserRepository;
  let mockPasswordService: IPasswordService;
  const existingUser = new User({
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashed_password',
    role: UserRole.MEMBER,
  });

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    mockPasswordService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
  });

  it('should authenticate a user with correct credentials', async () => {
    // Arrange
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);
    (mockPasswordService.compare as jest.Mock).mockResolvedValue(true);
    const authenticateUser = new AuthenticateUser(mockUserRepository, mockPasswordService);
    const input = { email: 'john.doe@example.com', password: 'password123' };

    // Act
    const result = await authenticateUser.execute(input);

    // Assert
    expect(result).toEqual(existingUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockPasswordService.compare).toHaveBeenCalledWith(input.password, existingUser.passwordHash);
  });

  it('should throw an error for a non-existent user', async () => {
    // Arrange
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    const authenticateUser = new AuthenticateUser(mockUserRepository, mockPasswordService);
    const input = { email: 'nonexistent@example.com', password: 'password123' };

    // Act & Assert
    await expect(authenticateUser.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for an incorrect password', async () => {
    // Arrange
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);
    (mockPasswordService.compare as jest.Mock).mockResolvedValue(false);
    const authenticateUser = new AuthenticateUser(mockUserRepository, mockPasswordService);
    const input = { email: 'john.doe@example.com', password: 'wrong_password' };

    // Act & Assert
    await expect(authenticateUser.execute(input)).rejects.toThrow('Invalid credentials');
  });
});
