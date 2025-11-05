import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly API_URL = 'http://localhost:3000'; // Assuming backend runs on port 3000

  constructor(private http: HttpClient) { }

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.API_URL}/loans/my-loans`);
  }
}
