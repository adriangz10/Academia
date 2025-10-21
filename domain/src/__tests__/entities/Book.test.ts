import { Book, BookProps } from '../../entities/Book';
import { v4 as uuidv4 } from 'uuid';

describe('Book Entity', () => {
  it('should create a book instance with correct properties', () => {
    const props: BookProps = {
      id: uuidv4(),
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-64015-7',
      totalQuantity: 10,
      quantityAvailable: 10,
    };
    const book = new Book(props);
    expect(book).toBeInstanceOf(Book);
    expect(book.title).toBe(props.title);
  });

  it('should throw an error if title is empty', () => {
    const props: BookProps = {
      id: uuidv4(),
      title: '',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-64015-7',
      totalQuantity: 10,
      quantityAvailable: 10,
    };
    expect(() => new Book(props)).toThrow('Book title cannot be empty');
  });

  it('should throw an error if totalQuantity is negative', () => {
    const props: BookProps = {
      id: uuidv4(),
      title: 'A Book',
      author: 'An Author',
      isbn: '12345',
      totalQuantity: -1,
      quantityAvailable: -1,
    };
    expect(() => new Book(props)).toThrow('Quantity cannot be negative');
  });

  it('should throw an error if quantityAvailable is greater than totalQuantity', () => {
    const props: BookProps = {
      id: uuidv4(),
      title: 'A Book',
      author: 'An Author',
      isbn: '12345',
      totalQuantity: 5,
      quantityAvailable: 6,
    };
    expect(() => new Book(props)).toThrow('Available quantity cannot be greater than total quantity');
  });
});
