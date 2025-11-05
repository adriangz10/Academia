import { ILoanRepository } from '../../repositories/ILoanRepository';
import { IBookRepository } from '../../repositories/IBookRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Loan } from '../../entities/Loan';
import { Book } from '../../entities/Book';
import { User } from '../../entities/User';

interface GetUserLoansResponse extends Loan {
  book: Book;
}

export class GetUserLoans {
  constructor(
    private readonly loanRepository: ILoanRepository,
    private readonly bookRepository: IBookRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<GetUserLoansResponse[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const loans = await this.loanRepository.findByUserId(userId);

    const loansWithBooks = await Promise.all(
      loans.map(async (loan) => {
        const book = await this.bookRepository.findById(loan.bookId);
        if (!book) {
          // This should ideally not happen if data is consistent
          throw new Error(`Book with id ${loan.bookId} not found for loan ${loan.id}`);
        }
        return { ...loan, book, returned: !!loan.returnDate };
      })
    );

    return loansWithBooks;
  }
}
