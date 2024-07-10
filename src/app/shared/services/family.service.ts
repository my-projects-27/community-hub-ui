import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { DuesSearchDto, DuesSummaryDto, Family, FamilyDue, FamilySearch } from '../../models/family.model';
import { CustomResponse } from '../../models/config.model';
import { DropdownObject } from '../../models/dropdown.model';

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

  familyAutoComplete(searchTerm:string){
    return this.http.get<DropdownObject[]>(`${this.authService.API_URL}family/family-auto-complete?searchTerm=${searchTerm}`,this.authService.getHeaders());
  }

  saveFamilyDue(familyDue:FamilyDue){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}family/add-dues`,familyDue,this.authService.getHeaders());
  }
  searchFamilyDues(familyDuesDto:DuesSearchDto){
    return this.http.post<FamilyDue[]>(`${this.authService.API_URL}family/filter-dues`,familyDuesDto,this.authService.getHeaders());
  }
  countSearchFamilyDues(familyDuesDto:DuesSearchDto){
    return this.http.post<{count:0}>(`${this.authService.API_URL}family/search-count-dues`,familyDuesDto,this.authService.getHeaders());
  }

  getDuesSumarryFamilyById(familyId:string){
    return this.http.get<DuesSummaryDto>(`${this.authService.API_URL}family/dues-summary?familyId=${familyId}`,this.authService.getHeaders());
  }
  deleteFamilyDueById(id:number){
    return this.http.get<CustomResponse>(`${this.authService.API_URL}family/delete-due?dueId=${id}`,this.authService.getHeaders())
  }
}
