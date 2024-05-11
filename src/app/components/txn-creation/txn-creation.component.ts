import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../shared/services/transactions.service';
import { CustomResponse, ResponseType } from '../../models/config.model';
import { Transaction } from '../../models/transaction.model';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { AccountsService } from '../../shared/services/accounts.service';
import { AccountHead, AccountSearchDto } from '../../models/accounts.model';
import { FamilyService } from '../../shared/services/family.service';
import { DropdownObject } from '../../models/dropdown.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-txn-creation',
  templateUrl: './txn-creation.component.html',
  styleUrl: './txn-creation.component.scss'
})
export class TxnCreationComponent implements OnInit{

  transaction:Transaction = new Transaction();
  selectedAccount:AccountHead=new AccountHead();
  dialogEntity: DialogEntity = new DialogEntity();
  famlies:DropdownObject[]=[];
  txnTypes:string[]=["PAYMENT","RECEIPT"]
  searchTerm=""

  constructor(public txnsService:TransactionsService,private dialog: MatDialog,public accountService:AccountsService,public familyService:FamilyService,private datePipe:DatePipe) { }
 
  ngOnInit(){
    var acc=new AccountSearchDto();
    acc.pageSize=1000;
    acc.offset=0;
    this.transaction.txnDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.accountService.searchAccounts(acc)
    .subscribe(res=>this.accountService.accounts=res,err=>this.handleError(err));
  }

  displayFn(option: any): string {
    return option ? option.id : '';
  }
  onOptionSelected(event:any){
    this.transaction.familyName=event.option.value.value;
    this.transaction.familyCode=event.option.value.id;
  }
  autocompleteFamily(){
    if (this.searchTerm.trim() === '') {
      this.famlies = [];
      this.transaction.familyName="";
      this.transaction.familyCode="";
      return;
    }
    this.familyService.familyAutoComplete(this.searchTerm)
      .pipe(debounceTime(2000),distinctUntilChanged())
      .subscribe(res=>this.famlies=res,err=>this.handleError(err));
  }
  onDateChange(event: any) {
    if(event.value)
      this.transaction.txnDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
    else
      this.transaction.txnDate=""
  }

  onAccountSelect(){
    if(this.selectedAccount.id){
      this.transaction.accountId=this.selectedAccount.id;
      this.transaction.familyTxnAllowed=this.selectedAccount.familyTxnAllowed;
      this.transaction.txnType=this.selectedAccount.type=="BOTH"?"":this.selectedAccount.type;
    }else{
      this.transaction.accountId=0;
      this.transaction.familyTxnAllowed=false;
      this.transaction.txnType="";
    }
  }

  saveTransaction(){
    this.txnsService.saveTransaction(this.transaction).subscribe(res=>{
      this.showSuccessDialog(res);
    },err=>this.handleError(err));
  }

  showSuccessDialog(res:CustomResponse){
    this.dialogEntity = new DialogEntity();
    this.dialogEntity.message = res.message;
    if(ResponseType.SUCCESS == res.responseType){
      this.dialogEntity.title = DialogType.SUCCESS;
      this.dialogEntity.type = DialogType.SUCCESS;
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
    this.famlies=[];
  }
}
