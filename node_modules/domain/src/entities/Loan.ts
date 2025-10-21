export interface LoanProps {
  id: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
}

export class Loan {
  public readonly id: string;
  public readonly bookId: string;
  public readonly userId: string;
  public readonly loanDate: Date;
  public readonly dueDate: Date;
  public returnDate?: Date;

  constructor(props: LoanProps) {
    this.id = props.id;
    this.bookId = props.bookId;
    this.userId = props.userId;
    this.loanDate = props.loanDate;
    this.dueDate = props.dueDate;
    this.returnDate = props.returnDate;
  }

  public return(): void {
    if (this.returnDate) {
      throw new Error('Loan has already been returned');
    }
    this.returnDate = new Date();
  }
}
