import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.model';
import { BookListComponent } from '../../components/book-list/book-list.component';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookListComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  books$!: Observable<Book[]>;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.books$ = this.bookService.getBooks();
  }

  onLoan(bookId: string) {
    this.bookService.loanBook(bookId).subscribe();
  }

  onReturn(bookId: string) {
    this.bookService.returnBook(bookId).subscribe();
  }
}
