import { IBookRepository } from '../repositories/IBookRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { Loan } from '../entities/Loan';
import { v4 as uuidv4 } from 'uuid';

interface LoanBookInput {
  userId: string;
  bookId: string;
}

export class LoanBook {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bookRepository: IBookRepository,
    private readonly loanRepository: ILoanRepository
  ) {}

  async execute({ userId, bookId }: LoanBookInput): Promise<Loan> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.quantityAvailable < 1) {
      throw new Error('Book not available for loan');
    }

    book.quantityAvailable -= 1;
    await this.bookRepository.update(book);

    const loanDate = new Date();
    const dueDate = new Date(loanDate);
    dueDate.setDate(loanDate.getDate() + 14); // 2-week loan period

    const loan = new Loan({
      id: uuidv4(),
      userId,
      bookId,
      loanDate,
      dueDate,
    });

    await this.loanRepository.save(loan);

    return loan;
  }
}
