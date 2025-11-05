import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    {
      id: '1',
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-64015-7',
      totalQuantity: 10,
      quantityAvailable: 7
    },
    {
      id: '2',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-00221-4',
      totalQuantity: 5,
      quantityAvailable: 2
    },
    {
      id: '3',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0-141-43951-8',
      totalQuantity: 3,
      quantityAvailable: 3
    }
  ];

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  loanBook(bookId: string): Observable<Book | undefined> {
    const book = this.books.find(b => b.id === bookId);
    if (book && book.quantityAvailable > 0) {
      book.quantityAvailable--;
    }
    return of(book);
  }

  returnBook(bookId: string): Observable<Book | undefined> {
    const book = this.books.find(b => b.id === bookId);
    if (book && book.quantityAvailable < book.totalQuantity) {
      book.quantityAvailable++;
    }
    return of(book);
  }
}
