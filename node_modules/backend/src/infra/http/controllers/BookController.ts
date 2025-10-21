import { Request, Response } from 'express';
import { AddBook } from 'domain/src/use-cases/AddBook';
import { UpdateBookDetails } from 'domain/src/use-cases/UpdateBookDetails';
import { RemoveBook } from 'domain/src/use-cases/RemoveBook';

export class BookController {
  constructor(
    private readonly addBook: AddBook,
    private readonly updateBookDetails: UpdateBookDetails,
    private readonly removeBook: RemoveBook
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, author, isbn, totalQuantity } = req.body;
      const book = await this.addBook.execute({ title, author, isbn, totalQuantity }, req.user!); // req.user es añadido por el authMiddleware
      return res.status(201).json(book);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title, author, isbn, totalQuantity } = req.body;
      const book = await this.updateBookDetails.execute({ id, title, author, isbn, totalQuantity }, req.user!); 
      return res.status(200).json(book);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.removeBook.execute({ id }, req.user!); 
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
