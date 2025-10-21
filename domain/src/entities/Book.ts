export interface BookProps {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalQuantity: number;
  quantityAvailable: number;
}

export class Book {
  public readonly id: string;
  public readonly title: string;
  public readonly author: string;
  public readonly isbn: string;
  public totalQuantity: number;
  public quantityAvailable: number;

  constructor(props: BookProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Book title cannot be empty');
    }
    if (props.totalQuantity < 0 || props.quantityAvailable < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (props.quantityAvailable > props.totalQuantity) {
      throw new Error('Available quantity cannot be greater than total quantity');
    }

    this.id = props.id;
    this.title = props.title;
    this.author = props.author;
    this.isbn = props.isbn;
    this.totalQuantity = props.totalQuantity;
    this.quantityAvailable = props.quantityAvailable;
  }
}
