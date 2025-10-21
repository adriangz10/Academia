import { User, UserProps, UserRole } from '../../entities/User';
import { v4 as uuidv4 } from 'uuid';

describe('User Entity', () => {
  it('should create a user instance with the correct properties', () => {
    const id = uuidv4();
    const props: UserProps = {
      id: id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashedpassword',
      role: UserRole.MEMBER,
    };

    const user = new User(props);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(id);
    expect(user.name).toBe('John Doe');
    expect(user.role).toBe(UserRole.MEMBER);
  });

  it('should throw an error if the name is empty', () => {
    const props: UserProps = {
      id: uuidv4(),
      name: '',
      email: 'john.doe@example.com',
      passwordHash: 'hashedpassword',
      role: UserRole.MEMBER,
    };

    expect(() => new User(props)).toThrow('User name cannot be empty');
  });

  it('should throw an error if the email is invalid', () => {
    const props: UserProps = {
      id: uuidv4(),
      name: 'John Doe',
      email: 'invalid-email',
      passwordHash: 'hashedpassword',
      role: UserRole.MEMBER,
    };

    expect(() => new User(props)).toThrow('Invalid email format');
  });

  it('should throw an error for an invalid role', () => {
    const props: UserProps = {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashedpassword',
      role: 'INVALID_ROLE' as UserRole,
    };

    expect(() => new User(props)).toThrow('Invalid role: INVALID_ROLE');
  });
});
