import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { CustomResponse, ResponseType } from '../../models/config.model';
import { TXnsProcessDto, Transaction, TransactionSearchDto } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http:HttpClient,private authService:AuthService) { }

  saveTransaction(transaction:Transaction){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}txns/save-transaction`,transaction,this.authService.getHeaders());
  }
  
  searchCountTransactions(searchDto:TransactionSearchDto){
    return this.http.post<{"count":number}>(`${this.authService.API_URL}txns/search-count-transactions`,searchDto,this.authService.getHeaders());
  }

  searchTransactions(searchDto:TransactionSearchDto){
    return this.http.post<Transaction[]>(`${this.authService.API_URL}txns/search-transactions`,searchDto,this.authService.getHeaders());
  }

  processTransactions(txns:TXnsProcessDto[]){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}txns/process-transaction`,txns,this.authService.getHeaders())
  }
}
