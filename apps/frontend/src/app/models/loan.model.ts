import { Book } from './book.model';

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  book: Book;
  returned: boolean;
}
