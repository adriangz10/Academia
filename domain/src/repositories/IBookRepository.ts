import { Book } from '../entities/Book';

export interface IBookRepository {
  findByIsbn(isbn: string): Promise<Book | null>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<void>;
  update(book: Book): Promise<Book>;
  delete(id: string): Promise<void>;
}
