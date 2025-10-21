import { AddBook } from '../../use-cases/AddBook';
import { Book } from '../../entities/Book';
import { IBookRepository } from '../../repositories/IBookRepository';
import { User, UserRole } from '../../entities/User';

describe('AddBook Use Case', () => {
  let mockBookRepository: IBookRepository;
  const adminUser = new User({ id: 'admin-id', name: 'Admin', email: 'admin@test.com', passwordHash: 'hash', role: UserRole.ADMIN });
  const memberUser = new User({ id: 'member-id', name: 'Member', email: 'member@test.com', passwordHash: 'hash', role: UserRole.MEMBER });

  beforeEach(() => {
    mockBookRepository = {
      findByIsbn: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
  });

  it('should allow an ADMIN to add a new book', async () => {
    // Arrange
    (mockBookRepository.findByIsbn as jest.Mock).mockResolvedValue(null);
    const addBook = new AddBook(mockBookRepository);
    const input = {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-345-33968-3',
      totalQuantity: 5,
    };

    // Act
    const result = await addBook.execute(input, adminUser);

    // Assert
    expect(result).toBeInstanceOf(Book);
    expect(result.title).toBe(input.title);
    expect(result.quantityAvailable).toBe(input.totalQuantity);
    expect(mockBookRepository.save).toHaveBeenCalledWith(expect.any(Book));
  });

  it('should prevent a MEMBER from adding a new book', async () => {
    // Arrange
    const addBook = new AddBook(mockBookRepository);
    const input = { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: 'test-isbn', totalQuantity: 5 };

    // Act & Assert
    await expect(addBook.execute(input, memberUser)).rejects.toThrow('You do not have permission to perform this action');
    expect(mockBookRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if a book with the same ISBN already exists', async () => {
    // Arrange
    const existingBook = new Book({ id: '1', title: 'Test', author: 'Test', isbn: '123', totalQuantity: 1, quantityAvailable: 1 });
    (mockBookRepository.findByIsbn as jest.Mock).mockResolvedValue(existingBook);
    const addBook = new AddBook(mockBookRepository);
    const input = {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-345-33968-3',
      totalQuantity: 5,
    };

    // Act & Assert
    await expect(addBook.execute(input, adminUser)).rejects.toThrow('Book with this ISBN already exists');
  });
});
