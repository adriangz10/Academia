import { Loan } from '../entities/Loan';

export interface ILoanRepository {
  save(loan: Loan): Promise<Loan>;
  findActiveByBookId(bookId: string): Promise<Loan | null>;
  findByUserId(userId: string): Promise<Loan[]>;
  update(loan: Loan): Promise<Loan>;
}
