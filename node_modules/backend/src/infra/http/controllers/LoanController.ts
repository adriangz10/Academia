import { Request, Response } from 'express';
import { LoanBook } from 'domain/src/use-cases/LoanBook';
import { ReturnBook } from 'domain/src/use-cases/ReturnBook';
import { GetUserLoans } from 'domain/src/use-cases/GetUserLoans';

export class LoanController {
  constructor(
    private readonly loanBook: LoanBook,
    private readonly returnBook: ReturnBook,
    private readonly getUserLoans: GetUserLoans
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.body;
      const userId = req.user!.id;
      const loan = await this.loanBook.execute({ userId, bookId });
      return res.status(201).json(loan);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async return(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const loan = await this.returnBook.execute({ loanId: id }, req.user!); 
      return res.status(200).json(loan);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async myLoans(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const loans = await this.getUserLoans.execute(userId);
      return res.status(200).json(loans);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
