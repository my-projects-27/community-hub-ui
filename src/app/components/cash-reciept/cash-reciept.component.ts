import { Component } from '@angular/core';
import { CashReceiptDto, Transaction } from '../../models/transaction.model';
import { DatePipe } from '@angular/common';
import { FamilyService } from '../../shared/services/family.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsService } from '../../shared/services/transactions.service';
import { AccountsService } from '../../shared/services/accounts.service';
import { AccountSearchDto } from '../../models/accounts.model';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { DropdownObject } from '../../models/dropdown.model';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DuesSummaryDto } from '../../models/family.model';
import { CustomResponse, ResponseType } from '../../models/config.model';

@Component({
  selector: 'app-cash-reciept',
  templateUrl: './cash-reciept.component.html',
  styleUrl: './cash-reciept.component.scss'
})
export class CashRecieptComponent {
  cashReceipt:CashReceiptDto=new CashReceiptDto();
  dialogEntity: DialogEntity = new DialogEntity();
  famlies:DropdownObject[]=[];
  searchTerm="";

  constructor(public txnsService:TransactionsService,private dialog: MatDialog,public accountService:AccountsService,public familyService:FamilyService,private datePipe:DatePipe) { }
  
  ngOnInit(){
    var acc=new AccountSearchDto();
    acc.pageSize=1000;
    acc.offset=0;
    this.transactionsReset()
    this.accountService.searchAccounts(acc)
    .subscribe(res=>this.accountService.accounts=res,err=>this.handleError(err));
  }

  displayFn(option: any): string {
    return option ? option.id : '';
  }
  onOptionSelected(event:any){
    this.cashReceipt.familyName=event.option.value.value;
    this.cashReceipt.familyCode=event.option.value.id;
    this.cashReceipt.transaction=[];
    this.familyService.getDuesSumarryFamilyById(this.cashReceipt.familyCode).subscribe((res:DuesSummaryDto)=>{
      for (let key of Object.keys(res.amountDueMap)){
        let value=res.amountDueMap[key]
        let txn=new Transaction();
        txn.accountId=parseFloat(key);
        txn.dueAmount=value;
        txn.amount=0;
        this.amountChange(txn);
        this.cashReceipt.transaction.push(txn);
      }
      this.cashReceipt.totalDueAmount=res.totalDueAmount;
      this.cashReceipt.totalBalanceAmount=res.totalDueAmount;
    })
  }
  autocompleteFamily(){
    if (this.searchTerm.trim() === '') {
      this.famlies = [];
      this.transactionsReset();
      return;
    }
    this.familyService.familyAutoComplete(this.searchTerm)
      .pipe(debounceTime(2000),distinctUntilChanged())
      .subscribe(res=>this.famlies=res,err=>this.handleError(err));
  }

  transactionsReset(){
    this.cashReceipt.transaction.forEach(txn=>{
      txn.familyCode="";
      txn.familyName="";
    })
    this.cashReceipt.txnDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }

  onDateChange(event: any) {
    if(event.value)
      this.cashReceipt.txnDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
    else
      this.cashReceipt.txnDate=""
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

  amountChange(txn:Transaction){
    txn.balanceAmount=txn.dueAmount-txn.amount;
    this.cashReceipt.totalBalanceAmount=0;
    this.cashReceipt.amount=0;
    this.cashReceipt.transaction.forEach(t=>{
      this.cashReceipt.totalBalanceAmount+=t.balanceAmount;
      this.cashReceipt.amount+=t.amount; 
    })
  }
  clearAllDues(){
    this.cashReceipt.transaction.forEach(txn=>{
      txn.amount=txn.dueAmount;
      txn.balanceAmount=0;
    })
    this.cashReceipt.amount=this.cashReceipt.totalDueAmount;
    this.cashReceipt.totalBalanceAmount=0;
  }
  saveReceipt(){
    this.cashReceipt.transaction.forEach(txn=>{
      txn.txnDate=this.cashReceipt.txnDate;
      txn.familyCode=this.cashReceipt.familyCode;
      txn.remarks=this.cashReceipt.comment;
      txn.txnRef=this.cashReceipt.txnRefNo;
      txn.txnType="RECEIPT";
    });
    this.txnsService.saveCashReceipt(this.cashReceipt).subscribe(res=>{
      this.showSuccessDialog(res)
      this.cashReceipt=new CashReceiptDto()
    },err=>this.handleError(err))
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
    this.openDialog()
  }

  confirmSaveReceipt(){
    this.dialogEntity = new DialogEntity();
    this.dialogEntity.message = ["Are You Sure You Want To Submit the Receipt?"];
    this.dialogEntity.title = DialogType.CONFIRM;
    this.dialogEntity.type = DialogType.CONFIRM;
    this.dialogEntity.textCancelButton="No";
    this.dialogEntity.textOkayButton="Yes";
    this.dialogEntity.okayButtonHandler=this.saveReceipt.bind(this);
    this.openDialog();
  }
  openDialog(){
    this.dialog.open(ConfirmModalComponent, {
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      data: this.dialogEntity
    });
  }
}
