import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {MatCardModule, MatCardTitle} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from './shared/services/auth.service';
import { ConfirmModalComponent } from './shared/modals/confirm-modal/confirm-modal.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CreateFamilyComponent } from './components/create-family/create-family.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
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
import { TxnsRegisterComponent } from './components/txns-register/txns-register.component';
import { TxnCreationComponent } from './components/txn-creation/txn-creation.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TxnApprovalsComponent } from './components/txn-approvals/txn-approvals.component';
import { CustomSelectRendererComponent } from './shared/custom-select-renderer/custom-select-renderer.component';
import { CustomTextRendererComponent } from './shared/custom-text-renderer/custom-text-renderer.component';
import { CreateDuesComponent } from './components/create-dues/create-dues.component';
import { CashRecieptComponent } from './components/cash-reciept/cash-reciept.component';
import { CustomButtonRendererComponent } from './shared/custom-button-renderer/custom-button-renderer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MY_DATE_FORMATS } from './shared/constants';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    WelcomeComponent,
    ConfirmModalComponent,
    CreateFamilyComponent,
    MemberComponent,
    FamilySearchComponent,
    ConfigMasterComponent,
    ViewFamilyComponent,
    TxnsRegisterComponent,
    TxnCreationComponent,
    TxnApprovalsComponent,
    CustomSelectRendererComponent,
    CustomTextRendererComponent,
    CreateDuesComponent,
    CashRecieptComponent,
    CustomButtonRendererComponent,
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
    MatSidenavModule,MatListModule,AgGridModule,MatMenuModule,
    MatOptionModule,MatSelectModule,MatCheckboxModule,MatFormFieldModule, 
    MatTabsModule,MatRadioModule,MatDatepickerModule,MatAutocompleteModule,MatNativeDateModule
  ],
  providers: [
    AuthService,DropdownService,DatePipe,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Set locale to 'en-GB' for dd-MM-yyyy format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } // Custom date formats
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
