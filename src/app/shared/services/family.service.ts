import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Family, FamilySearch } from '../../models/family.model';
import { CustomResponse } from '../../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  totalRows:number=0;
  familyIdToView:string='';

  familyToUpdate:Family=new Family();

  constructor(private http:HttpClient,private authService:AuthService) { }

  saveFamily(family:Family){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}family/save-family`,family,this.authService.getHeaders());
  }

  searchFamily(family:FamilySearch){
    return this.http.post<Family[]>(`${this.authService.API_URL}family/search-family`,family,this.authService.getHeaders());
  }

  countSearchFamily(family:FamilySearch){
    return this.http.post<{count:0}>(`${this.authService.API_URL}family/search-count-family`,family,this.authService.getHeaders());
  }

  getFamilyById(familyId:string){
    return this.http.get<Family>(`${this.authService.API_URL}family/find-by-id?familyId=${familyId}`,this.authService.getHeaders());
  }

}
