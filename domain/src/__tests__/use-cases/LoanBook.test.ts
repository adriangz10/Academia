import { LoanBook } from '../../use-cases/LoanBook';
import { Book } from '../../entities/Book';
import { User, UserRole } from '../../entities/User';
import { Loan } from '../../entities/Loan';
import { IBookRepository } from '../../repositories/IBookRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { ILoanRepository } from '../../repositories/ILoanRepository';

describe('LoanBook Use Case', () => {
  let mockBookRepository: IBookRepository;
  let mockUserRepository: IUserRepository;
  let mockLoanRepository: ILoanRepository;

  const user = new User({ id: 'user-1', name: 'Test User', email: 'test@test.com', passwordHash: 'hash', role: UserRole.MEMBER });
  const book = new Book({ id: 'book-1', title: 'Test Book', author: 'Author', isbn: '123', totalQuantity: 5, quantityAvailable: 5 });

  beforeEach(() => {
    mockBookRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      findByIsbn: jest.fn(), 
      save: jest.fn(), 
      delete: jest.fn(),
      findAll: jest.fn(),
    };
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    mockLoanRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findActiveByBookId: jest.fn(),
      findActiveByUserId: jest.fn(),
      update: jest.fn(),
    };
  });

  it('should successfully loan a book', async () => {
    // Arrange
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(user);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(book);
    const loanBook = new LoanBook(mockUserRepository, mockBookRepository, mockLoanRepository);

    // Act
    const result = await loanBook.execute({ userId: 'user-1', bookId: 'book-1' });

    // Assert
    expect(result).toBeInstanceOf(Loan);
    expect(mockBookRepository.update).toHaveBeenCalledWith(expect.objectContaining({ quantityAvailable: 4 }));
    expect(mockLoanRepository.save).toHaveBeenCalledWith(expect.any(Loan));
  });

  it('should throw an error if user is not found', async () => {
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);
    const loanBook = new LoanBook(mockUserRepository, mockBookRepository, mockLoanRepository);
    await expect(loanBook.execute({ userId: 'user-1', bookId: 'book-1' })).rejects.toThrow('User not found');
  });

  it('should throw an error if book is not found', async () => {
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(user);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(null);
    const loanBook = new LoanBook(mockUserRepository, mockBookRepository, mockLoanRepository);
    await expect(loanBook.execute({ userId: 'user-1', bookId: 'book-1' })).rejects.toThrow('Book not found');
  });

  it('should throw an error if book is not available', async () => {
    const unavailableBook = new Book({ ...book, quantityAvailable: 0 });
    (mockUserRepository.findById as jest.Mock).mockResolvedValue(user);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(unavailableBook);
    const loanBook = new LoanBook(mockUserRepository, mockBookRepository, mockLoanRepository);
    await expect(loanBook.execute({ userId: 'user-1', bookId: 'book-1' })).rejects.toThrow('Book not available for loan');
  });
});