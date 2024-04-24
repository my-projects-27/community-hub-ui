import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { CreateFamilyComponent } from './components/create-family/create-family.component';
import { FamilySearchComponent } from './components/family-search/family-search.component';
import { ConfigMasterComponent } from './components/config-master/config-master.component';
import { ViewFamilyComponent } from './components/view-family/view-family.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full'},
  { path: 'search-family', component: FamilySearchComponent , pathMatch: 'full',canActivate: [AuthGuard]},
  { path: 'view-family', component: ViewFamilyComponent , pathMatch: 'full',canActivate: [AuthGuard]},
  { path: 'create-family', component: CreateFamilyComponent , pathMatch: 'full',canActivate: [AuthGuard]},
  { path: 'config-master', component: ConfigMasterComponent , pathMatch: 'full',canActivate: [AuthGuard]},
  { path: 'welcome', component: WelcomeComponent , pathMatch: 'full'},
  { path: '', component: WelcomeComponent , pathMatch: 'full'},
  { path: '*', redirectTo: 'welcome', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
