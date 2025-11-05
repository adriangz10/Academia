import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent {
  @Input() books: Book[] = [];
  @Output() loan = new EventEmitter<string>();
  @Output() return = new EventEmitter<string>();
}
