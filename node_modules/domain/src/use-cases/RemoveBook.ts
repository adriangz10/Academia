import { IBookRepository } from '../repositories/IBookRepository';
import { User, UserRole } from '../entities/User';

interface RemoveBookInput {
  id: string;
}

export class RemoveBook {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute({ id }: RemoveBookInput, user: User): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }

    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.quantityAvailable < book.totalQuantity) {
      throw new Error('Cannot remove a book with copies currently on loan');
    }

    await this.bookRepository.delete(id);
  }
}
