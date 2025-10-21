import { Loan } from 'domain/src/entities/Loan';
import { ILoanRepository } from 'domain/src/repositories/ILoanRepository';

export class InMemoryLoanRepository implements ILoanRepository {
  private loans: Loan[] = [];

  async save(loan: Loan): Promise<Loan> {
    this.loans.push(loan);
    return loan;
  }

  async findById(id: string): Promise<Loan | null> {
    const loan = this.loans.find(l => l.id === id);
    return loan || null;
  }

  async findActiveByBookId(bookId: string): Promise<Loan | null> {
    const loan = this.loans.find(l => l.bookId === bookId && !l.returnDate);
    return loan || null;
  }

  async findActiveByUserId(userId: string): Promise<Loan[]> {
    return this.loans.filter(l => l.userId === userId && !l.returnDate);
  }

  async update(loan: Loan): Promise<Loan> {
    const index = this.loans.findIndex(l => l.id === loan.id);
    if (index !== -1) {
      this.loans[index] = loan;
    }
    return loan;
  }
}
