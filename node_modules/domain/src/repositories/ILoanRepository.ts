import { Loan } from '../entities/Loan';

export interface ILoanRepository {
  save(loan: Loan): Promise<void>;
  findActiveByBookId(bookId: string): Promise<Loan | null>;
  update(loan: Loan): Promise<Loan>;
}
