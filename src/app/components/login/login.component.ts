import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';
import { DropdownService } from '../../shared/services/dropdown.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginRequest: LoginRequest = new LoginRequest();
  dialogEntity: DialogEntity = new DialogEntity();

  constructor(private authService: AuthService, private dialog: MatDialog,private router:Router,private dropdownService:DropdownService) { }

  ngOnInit(): void {
    this.loginRequest = new LoginRequest();
  }

  login() {
    this.authService.login(this.loginRequest).subscribe((res) => {
      this.authService.userDetails = res;
      this.dropdownService.getDropdowns();
      this.router.navigate(['/search-family']);
    },err=>{
      this.dialogEntity = new DialogEntity();
      this.dialogEntity.message = err.error.message? [err.error.message] : (err.status==403?["Access Denied"]:["Unknown Error Occoured!"]);
      this.dialogEntity.title = DialogType.ERROR;
      this.dialogEntity.type = DialogType.ERROR;
      this.dialog.open(ConfirmModalComponent, {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        hasBackdrop: true,
        maxHeight: '700px',
        data: this.dialogEntity
      });
    });
  }
}
