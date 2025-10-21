import { Book } from 'domain/src/entities/Book';
import { IBookRepository } from 'domain/src/repositories/IBookRepository';

export class InMemoryBookRepository implements IBookRepository {
  private books: Book[] = [];

  async save(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async findById(id: string): Promise<Book | null> {
    const book = this.books.find(b => b.id === id);
    return book || null;
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const book = this.books.find(b => b.isbn === isbn);
    return book || null;
  }

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async update(book: Book): Promise<Book> {
    const index = this.books.findIndex(b => b.id === book.id);
    if (index !== -1) {
      this.books[index] = book;
    }
    return book;
  }

  async delete(id: string): Promise<void> {
    this.books = this.books.filter(b => b.id !== id);
  }
}
