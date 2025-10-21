import { Book } from '../entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';
import { User, UserRole } from '../entities/User';

interface UpdateBookDetailsInput {
  id: string;
  title?: string;
  author?: string;
  isbn?: string;
  totalQuantity?: number;
}

export class UpdateBookDetails {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(input: UpdateBookDetailsInput, user: User): Promise<Book> {
    if (user.role !== UserRole.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }

    const book = await this.bookRepository.findById(input.id);
    if (!book) {
      throw new Error('Book not found');
    }

    // Check for ISBN conflict if ISBN is being updated
    if (input.isbn && input.isbn !== book.isbn) {
      const conflictingBook = await this.bookRepository.findByIsbn(input.isbn);
      if (conflictingBook && conflictingBook.id !== book.id) {
        throw new Error('Another book with this ISBN already exists');
      }
    }

    // Validate and update totalQuantity
    if (input.totalQuantity !== undefined) {
      const onLoan = book.totalQuantity - book.quantityAvailable;
      if (input.totalQuantity < onLoan) {
        throw new Error('Total quantity cannot be less than the number of books currently on loan');
      }
      const quantityDiff = input.totalQuantity - book.totalQuantity;
      book.totalQuantity = input.totalQuantity;
      book.quantityAvailable += quantityDiff;
    }

    // Update other properties
    book.title = input.title ?? book.title;
    book.author = input.author ?? book.author;
    book.isbn = input.isbn ?? book.isbn;

    const updatedBook = await this.bookRepository.update(book);

    return updatedBook;
  }
}
