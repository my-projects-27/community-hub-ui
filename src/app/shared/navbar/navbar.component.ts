import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  constructor(public authService:AuthService,public router:Router) {}
  ngOnInit(): void {
  }

  configVisible():boolean{
    return this.authService.userDetails.user&&this.authService.userDetails.user.authorities.findIndex(a=>a.authority=="ADMIN")!=-1
  }

  login(){
    this.router.navigate(['/login']);
  }
  
  logout(){
    this.authService.userDetails=new LoginResponse();
    this.router.navigate(['/login']);
  }
}
