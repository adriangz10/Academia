import { UpdateBookDetails } from '../../use-cases/UpdateBookDetails';
import { Book } from '../../entities/Book';
import { IBookRepository } from '../../repositories/IBookRepository';
import { User, UserRole } from '../../entities/User';

describe('UpdateBookDetails Use Case', () => {
  let mockBookRepository: IBookRepository;
  const adminUser = new User({ id: 'admin-id', name: 'Admin', email: 'admin@test.com', passwordHash: 'hash', role: UserRole.ADMIN });
  const memberUser = new User({ id: 'member-id', name: 'Member', email: 'member@test.com', passwordHash: 'hash', role: UserRole.MEMBER });
  const existingBook = new Book({
    id: 'book-123',
    title: 'Old Title',
    author: 'Old Author',
    isbn: '12345',
    totalQuantity: 10,
    quantityAvailable: 10,
  });

  beforeEach(() => {
    mockBookRepository = {
      findByIsbn: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
  });

  it('should allow an ADMIN to update book details', async () => {
    // Arrange
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(new Book({ ...existingBook }));
    (mockBookRepository.update as jest.Mock).mockImplementation(book => Promise.resolve(book));
    const updateBook = new UpdateBookDetails(mockBookRepository);
    const input = {
      id: 'book-123',
      title: 'New Title',
      author: 'New Author',
    };

    // Act
    const result = await updateBook.execute(input, adminUser);

    // Assert
    expect(result.title).toBe('New Title');
    expect(result.author).toBe('New Author');
    expect(mockBookRepository.update).toHaveBeenCalledWith(expect.any(Book));
  });

  it('should prevent a MEMBER from updating book details', async () => {
    // Arrange
    const updateBook = new UpdateBookDetails(mockBookRepository);
    const input = { id: 'book-123', title: 'New Title' };

    // Act & Assert
    await expect(updateBook.execute(input, memberUser)).rejects.toThrow('You do not have permission to perform this action');
    expect(mockBookRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the book is not found', async () => {
    // Arrange
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(null);
    const updateBook = new UpdateBookDetails(mockBookRepository);
    const input = { id: 'non-existent-id', title: 'New Title' };

    // Act & Assert
    await expect(updateBook.execute(input, adminUser)).rejects.toThrow('Book not found');
  });

  it('should throw an error if new ISBN already exists for another book', async () => {
    // Arrange
    const bookToUpdate = new Book({ ...existingBook });
    const otherBookWithISBN = new Book({ id: 'other-book', title: 'Other', author: 'Other', isbn: '54321', totalQuantity: 1, quantityAvailable: 1 });
    
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(bookToUpdate);
    (mockBookRepository.findByIsbn as jest.Mock).mockResolvedValue(otherBookWithISBN);
    
    const updateBook = new UpdateBookDetails(mockBookRepository);
    const input = { 
      id: 'book-123',
      isbn: '54321',
    };

    // Act & Assert
    await expect(updateBook.execute(input, adminUser)).rejects.toThrow('Another book with this ISBN already exists');
  });

  it('should throw an error if new totalQuantity is less than books on loan', async () => {
    // Arrange
    const bookWithLoans = new Book({
      id: 'book-with-loans',
      title: 'On Loan Book',
      author: 'Author',
      isbn: '123-loans',
      totalQuantity: 10,
      quantityAvailable: 7, // 3 books are on loan
    });
    (mockBookRepository.findById as jest.Mock).mockResolvedValue(bookWithLoans);
    const updateBook = new UpdateBookDetails(mockBookRepository);
    const input = {
      id: 'book-with-loans',
      totalQuantity: 2, // Trying to set total to less than the 3 on loan
    };

    // Act & Assert
    await expect(updateBook.execute(input, adminUser)).rejects.toThrow('Total quantity cannot be less than the number of books currently on loan');
  });
});
