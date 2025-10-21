import { RemoveBook } from '../../use-cases/RemoveBook';
import { Book } from '../../entities/Book';
import { IBookRepository } from '../../repositories/IBookRepository';
import { User, UserRole } from '../../entities/User';

describe('RemoveBook Use Case', () => {
  let mockBookRepository: IBookRepository;
  const adminUser = new User({ id: 'admin-id', name: 'Admin', email: 'admin@test.com', passwordHash: 'hash', role: UserRole.ADMIN });
  const memberUser = new User({ id: 'member-id', name: 'Member', email: 'member@test.com', passwordHash: 'hash', role: UserRole.MEMBER });

  beforeEach(() => {
    mockBookRepository = {
      findByIsbn: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };
  });

  it('should allow an ADMIN to remove a book', async () => {
    // Arrange
    const bookToRemove = new Book({ id: '123', title: 'Test', author: 'Test', isbn: '123', totalQuantity: 5, quantityAvailable: 5 });
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(bookToRemove);
    const removeBook = new RemoveBook(mockBookRepository);

    // Act
    await removeBook.execute({ id: '123' }, adminUser);

    // Assert
    expect(mockBookRepository.delete).toHaveBeenCalledWith('123');
  });

  it('should prevent a MEMBER from removing a book', async () => {
    // Arrange
    const removeBook = new RemoveBook(mockBookRepository);

    // Act & Assert
    await expect(removeBook.execute({ id: '123' }, memberUser)).rejects.toThrow('You do not have permission to perform this action');
    expect(mockBookRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw an error if the book is not found', async () => {
    // Arrange
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(null);
    const removeBook = new RemoveBook(mockBookRepository);

    // Act & Assert
    await expect(removeBook.execute({ id: 'non-existent' }, adminUser)).rejects.toThrow('Book not found');
  });

  it('should throw an error if the book has copies on loan', async () => {
    // Arrange
    const bookOnLoan = new Book({ id: '123', title: 'Test', author: 'Test', isbn: '123', totalQuantity: 5, quantityAvailable: 4 });
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(bookOnLoan);
    const removeBook = new RemoveBook(mockBookRepository);

    // Act & Assert
    await expect(removeBook.execute({ id: '123' }, adminUser)).rejects.toThrow('Cannot remove a book with copies currently on loan');
  });
});
