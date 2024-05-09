import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(state.url!="/login" && state.url!="/welcome"&&!this.authService.userDetails.accessToken){
      this.router.navigate(['/login']);
    }else if(state.url=="/config-master"&&this.authService.userDetails.user&&this.authService.userDetails.user.authorities.findIndex(a=>a.authority=="ADMIN")==-1){
      this.router.navigate(['/search-family']);
    }
    return true;
  }
}