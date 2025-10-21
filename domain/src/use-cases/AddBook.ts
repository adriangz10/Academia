import { Book } from '../entities/Book';
import { IBookRepository } from '../repositories/IBookRepository';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../entities/User';

interface AddBookInput {
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
}

export class AddBook {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute({ title, author, isbn, totalQuantity }: AddBookInput, user: User): Promise<Book> {
    if (user.role !== UserRole.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }

    const existingBook = await this.bookRepository.findByIsbn(isbn);
    if (existingBook) {
      throw new Error('Book with this ISBN already exists');
    }

    const book = new Book({
      id: uuidv4(),
      title,
      author,
      isbn,
      totalQuantity,
      quantityAvailable: totalQuantity, // Initially, all are available
    });

    await this.bookRepository.save(book);

    return book;
  }
}
