import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { DropdownObject, StaticDropdowns, bloodGroups } from '../../models/dropdown.model';
import { Branch, CommonReference, ConfigEntity, CustomResponse, Union, Unit } from '../../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService{

  unionList:DropdownObject[] = [];
  unitList:DropdownObject[] = [];
  branchList:DropdownObject[] = [];
  staticDropdowns:StaticDropdowns = new StaticDropdowns();
  bloodGroup:DropdownObject[] = [];

  unitmap:{ [key: string]: any; } = {};
  classificationMap:{ [key: string]: any; } = {};

  constructor(private http:HttpClient,private authService:AuthService) { 
    this.bloodGroup=bloodGroups;
  }

  getUnits(){
    return this.http.get<DropdownObject[]>(`${this.authService.API_URL}common/units`,this.authService.getHeaders());
  } 
  getBranches(){
    return this.http.get<DropdownObject[]>(`${this.authService.API_URL}common/branches`,this.authService.getHeaders());
  }
  getUnions(){
    return this.http.get<DropdownObject[]>(`${this.authService.API_URL}common/unions`,this.authService.getHeaders());
  }
  getStaticDropdowns(){
    return this.http.get<StaticDropdowns>(`${this.authService.API_URL}common/dropdowns`,{params:{dropdowns:["classifications","profession","modeOfContact","relationships"]},...this.authService.getHeaders()});
  }
  
  async getDropdowns(){
    const unions=await this.getUnions().toPromise();
    this.unionList=unions?unions:[];
    const branches=await this.getBranches().toPromise();
    this.branchList=branches?branches:[];
    const units=await this.getUnits().toPromise();
    this.unitList=units?units:[];
    const staList=await this.getStaticDropdowns().toPromise();
    this.staticDropdowns=staList?staList:new StaticDropdowns();
    this.unitList.forEach(d=>this.unitmap[d.id]=d.value);
    this.staticDropdowns.classifications.forEach(d=>this.classificationMap[d.id]=d.value);
  }

  saveUnions(union:Union){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}admin/save-union`,union,this.authService.getHeaders());
  }
  
  saveBranches(branch:Branch){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}admin/save-branch`,branch,this.authService.getHeaders());
  }

  saveUnits(unit:Unit){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}admin/save-unit`,unit,this.authService.getHeaders());
  }

  saveStaticDropdowns(configEntity:CommonReference){
    return this.http.post<CustomResponse>(`${this.authService.API_URL}admin/save-static-dropdowns`,configEntity,this.authService.getHeaders());
  }
  
}
