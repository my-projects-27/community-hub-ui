import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { CustomResponse } from '../../models/config.model';
import { AccountHead, AccountSearchDto } from '../../models/accounts.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  accounts:AccountHead[] = [];

  constructor(private http:HttpClient,private authService:AuthService) { }

  saveAccount(account:AccountHead){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}accounts/save-account`,account,this.authService.getHeaders());
  }

  searchAccounts(searchDto:AccountSearchDto){
    return this.http.post<AccountHead[]>(`${this.authService.API_URL}accounts/search-accounts`,searchDto,this.authService.getHeaders());
  }
  
}
