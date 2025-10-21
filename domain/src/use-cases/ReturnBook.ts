import { IBookRepository } from '../repositories/IBookRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { Loan } from '../entities/Loan';
import { User, UserRole } from '../entities/User';

interface ReturnBookInput {
  loanId: string;
}

export class ReturnBook {
  constructor(
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute({ loanId }: ReturnBookInput, user: User): Promise<Loan> {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new Error('You do not have permission to return this book');
    }

    if (loan.returnDate) {
      throw new Error('This loan has already been returned');
    }

    const book = await this.bookRepository.findById(loan.bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    loan.return();
    const updatedLoan = await this.loanRepository.update(loan);

    book.quantityAvailable += 1;
    await this.bookRepository.update(book);

    return updatedLoan;
  }
}
