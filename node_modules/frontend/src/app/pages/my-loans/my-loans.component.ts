import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-loans.component.html',
})
export class MyLoansComponent implements OnInit {
  loans$!: Observable<Loan[]>;
  private loanService = inject(LoanService);

  ngOnInit() {
    this.loans$ = this.loanService.getMyLoans();
  }
}
