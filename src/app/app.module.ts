import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {MatCardModule, MatCardTitle} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from './shared/services/auth.service';
import { ConfirmModalComponent } from './shared/modals/confirm-modal/confirm-modal.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatModalComponent } from './shared/modals/mat-modal/mat-modal.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CreateFamilyComponent } from './components/create-family/create-family.component';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { MemberComponent } from './components/member/member.component';
import { FamilySearchComponent } from './components/family-search/family-search.component';
import { ConfigMasterComponent } from './components/config-master/config-master.component';
import {MatRadioModule} from '@angular/material/radio';
import { MyErrorHandler } from './shared/error-handler/GlobalErrorHandler';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AgGridModule } from 'ag-grid-angular';
import { DropdownService } from './shared/services/dropdown.service';
import { ViewFamilyComponent } from './components/view-family/view-family.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    WelcomeComponent,
    ConfirmModalComponent,
    MatModalComponent,
    CreateFamilyComponent,
    MemberComponent,
    FamilySearchComponent,
    ConfigMasterComponent,
    ViewFamilyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,MatFormFieldModule,
    MatInputModule,MatCardTitle,
    HttpClientModule,FormsModule,MatDialogModule,
    MatDialogContent,MatDialogActions,MatDialogTitle,MatDialogClose,
    MatSidenavModule,MatListModule,AgGridModule,
    MatOptionModule,MatSelectModule,MatCheckboxModule,MatFormFieldModule, 
    MatTabsModule,MatRadioModule,MatDatepickerModule
  ],
  providers: [
    AuthService,DropdownService,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
