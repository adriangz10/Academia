import { ReturnBook } from '../../use-cases/ReturnBook';
import { Book } from '../../entities/Book';
import { User, UserRole } from '../../entities/User';
import { Loan } from '../../entities/Loan';
import { IBookRepository } from '../../repositories/IBookRepository';
import { ILoanRepository } from '../../repositories/ILoanRepository';

describe('ReturnBook Use Case', () => {
  let mockBookRepository: IBookRepository;
  let mockLoanRepository: ILoanRepository;

  const memberUser = new User({ id: 'user-1', name: 'Test User', email: 'test@test.com', passwordHash: 'hash', role: UserRole.MEMBER });
  const otherUser = new User({ id: 'user-2', name: 'Other User', email: 'other@test.com', passwordHash: 'hash', role: UserRole.MEMBER });
  const adminUser = new User({ id: 'admin-1', name: 'Admin User', email: 'admin@test.com', passwordHash: 'hash', role: UserRole.ADMIN });
  const book = new Book({ id: 'book-1', title: 'Test Book', author: 'Author', isbn: '123', totalQuantity: 5, quantityAvailable: 4 });
  const baseLoan = new Loan({ id: 'loan-1', userId: memberUser.id, bookId: book.id, loanDate: new Date(), dueDate: new Date() });

  beforeEach(() => {
    mockBookRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      findByIsbn: jest.fn(), save: jest.fn(), delete: jest.fn(), findAll: jest.fn(),
    };
    mockLoanRepository = {
      findById: jest.fn(),
      update: jest.fn().mockImplementation(loan => {
        loan.returnDate = new Date();
        return Promise.resolve(loan);
      }),
      save: jest.fn(),
      findActiveByBookId: jest.fn(),
      findActiveByUserId: jest.fn(),
    };
  });

  it('should allow the user who borrowed the book to return it', async () => {
    // Arrange
    const loan = new Loan({ ...baseLoan });
    (mockLoanRepository.findById as jest.Mock).mockResolvedValue(loan);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(book);
    const returnBook = new ReturnBook(mockLoanRepository, mockBookRepository);

    // Act
    const result = await returnBook.execute({ loanId: 'loan-1' }, memberUser);

    // Assert
    expect(result.returnDate).toBeDefined();
    expect(mockBookRepository.update).toHaveBeenCalledWith(expect.objectContaining({ quantityAvailable: 5 }));
    expect(mockLoanRepository.update).toHaveBeenCalledWith(expect.any(Loan));
  });

  it('should allow an ADMIN to return any book', async () => {
    const loan = new Loan({ ...baseLoan });
    (mockLoanRepository.findById as jest.Mock).mockResolvedValue(loan);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(book);
    const returnBook = new ReturnBook(mockLoanRepository, mockBookRepository);

    // Act
    await returnBook.execute({ loanId: 'loan-1' }, adminUser);

    // Assert
    expect(mockLoanRepository.update).toHaveBeenCalled();
  });

  it('should prevent another user from returning the book', async () => {
    const loan = new Loan({ ...baseLoan });
    (mockLoanRepository.findById as jest.Mock).mockResolvedValue(loan);
    const returnBook = new ReturnBook(mockLoanRepository, mockBookRepository);

    // Act & Assert
    await expect(returnBook.execute({ loanId: 'loan-1' }, otherUser)).rejects.toThrow('You do not have permission to return this book');
  });

  it('should throw an error if the loan is not found', async () => {
    (mockLoanRepository.findById as jest.Mock).mockResolvedValue(null);
    const returnBook = new ReturnBook(mockLoanRepository, mockBookRepository);
    await expect(returnBook.execute({ loanId: 'loan-1' }, memberUser)).rejects.toThrow('Loan not found');
  });

  it('should throw an error if the book record does not exist', async () => {
    const loan = new Loan({ ...baseLoan });
    (mockLoanRepository.findById as jest.Mock).mockResolvedValue(loan);
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(null);
    const returnBook = new ReturnBook(mockLoanRepository, mockBookRepository);
    await expect(returnBook.execute({ loanId: 'loan-1' }, memberUser)).rejects.toThrow('Book not found');
  });
});
