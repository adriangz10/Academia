import { Loan, LoanProps } from '../../entities/Loan';
import { v4 as uuidv4 } from 'uuid';

describe('Loan Entity', () => {
  it('should create a loan instance with correct properties', () => {
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 14); // 2 weeks loan period

    const props: LoanProps = {
      id: uuidv4(),
      bookId: 'book-1',
      userId: 'user-1',
      loanDate: now,
      dueDate: dueDate,
    };

    const loan = new Loan(props);

    expect(loan).toBeInstanceOf(Loan);
    expect(loan.id).toBe(props.id);
    expect(loan.bookId).toBe('book-1');
    expect(loan.userId).toBe('user-1');
    expect(loan.loanDate).toEqual(now);
    expect(loan.dueDate).toEqual(dueDate);
    expect(loan.returnDate).toBeUndefined();
  });
});
