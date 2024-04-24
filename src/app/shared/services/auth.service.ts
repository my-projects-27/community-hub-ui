import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL:string=`${environment.apiUrl}api/v1/`;
  userDetails!:LoginResponse;

  constructor(public http:HttpClient) {
    this.userDetails = new LoginResponse();
  }

  getHeaders(){
    return {"headers":new HttpHeaders().set('Authorization',`Bearer ${this.userDetails.accessToken}`)};
  }

  login(data:LoginRequest){
    return this.http.post<LoginResponse>(`${this.API_URL}auth/login`,data);
  }

}
