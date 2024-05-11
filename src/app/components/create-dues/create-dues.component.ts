import { Component, Inject, OnInit } from '@angular/core';
import { FamilyDue } from '../../models/family.model';
import { FamilyService } from '../../shared/services/family.service';
import { AccountsService } from '../../shared/services/accounts.service';
import { AccountHead, AccountSearchDto } from '../../models/accounts.model';
import { DatePipe } from '@angular/common';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CustomResponse, ResponseType } from '../../models/config.model';

@Component({
  selector: 'app-create-dues',
  templateUrl: './create-dues.component.html',
  styleUrl: './create-dues.component.scss'
})
export class CreateDuesComponent implements OnInit{

  familyDue:FamilyDue=new FamilyDue();
  dialogEntity: DialogEntity = new DialogEntity();

  constructor(@Inject(MAT_DIALOG_DATA)public familyData:{familyId:""},public familyService:FamilyService,public accountService:AccountsService,private datePipe:DatePipe,private dialog: MatDialog){
  }

  ngOnInit(): void {
    var acc=new AccountSearchDto();
    acc.pageSize=1000;
    acc.offset=0;
    this.familyDue.familyId=this.familyData.familyId;
    this.familyDue.date=this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.accountService.searchAccounts(acc)
      .subscribe(res=>this.accountService.accounts=res,err=>this.handleError(err));
  }

  onDateChange(event: any) {
    if(event.value)
      this.familyDue.date = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
    else
      this.familyDue.date=""
  }

  saveDues(){
    this.familyService.saveFamilyDue(this.familyDue).subscribe(res=>this.showSuccessDialog(res),err=>this.handleError(err))
  }

  handleError(err:any){
    this.dialogEntity = new DialogEntity();
    if(err.status==403){
      this.dialogEntity.message = ["Access Denied"];
    }else{
      this.dialogEntity.message = err.error&&err.error.message? (err.error.responseType=="FORM_VALIDATION_ERROR"?err.error.message:[err.error.message]): ["Unknown Error Occoured!"];
    }
    this.dialogEntity.title = err.error&&err.error.responseType=="FORM_VALIDATION_ERROR"?DialogType.FORM_VALIDATION_ERROR:DialogType.ERROR;
    this.dialogEntity.type = DialogType.ERROR;
    this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      data: this.dialogEntity
    });
  }
  showSuccessDialog(res:CustomResponse){
    this.dialogEntity = new DialogEntity();
    this.dialogEntity.message = res.message;
    if(ResponseType.SUCCESS == res.responseType){
      this.dialogEntity.title = DialogType.SUCCESS;
      this.dialogEntity.type = DialogType.SUCCESS;
      this.dialogEntity.okayButtonHandler=this.moveToFamilyDuesTab.bind(this);
    }else{
      this.dialogEntity.title = DialogType.ERROR;
      this.dialogEntity.type = DialogType.ERROR;
    }
    this.dialog.open(ConfirmModalComponent, {
      width: '100%',
      maxWidth: '400px',
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      data: this.dialogEntity
    });
  }

  moveToFamilyDuesTab(){
    this.dialog.closeAll()
  }
}
