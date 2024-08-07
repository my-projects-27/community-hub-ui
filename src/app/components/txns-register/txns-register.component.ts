import { Component } from '@angular/core';
import { TransactionSearchDto } from '../../models/transaction.model';
import { TransactionsService } from '../../shared/services/transactions.service';
import { GridOptions,GridApi } from 'ag-grid-community';
import {IDatasource} from 'ag-grid-community';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CustomButtonRendererComponent } from '../../shared/custom-button-renderer/custom-button-renderer.component';
import { CustomResponse, ResponseType } from '../../models/config.model';

@Component({
  selector: 'app-txns-register',
  templateUrl: './txns-register.component.html',
  styleUrl: './txns-register.component.scss'
})
export class TxnsRegisterComponent {
    txnSearchDto:TransactionSearchDto=new TransactionSearchDto(); 
    txnTypes:string[]=["PAYMENT","RECEIPT"]
    transferTypes:string[]=["CASH","TRANSFER"]
    statusList:string[]=['PENDING', 'APPROVED', 'REJECTED']
    txnGridApi!:GridApi;
    dialogEntity: DialogEntity = new DialogEntity();

    gridColTxnDef: any[] = [
      { headerName: "Delete", cellRenderer: CustomButtonRendererComponent, cellStyle: (params:any) =>{return {'margin-top':'5px'}},maxWidth:100},
      { headerName: 'Transaction ID', field: 'id',maxWidth:180  },
      { headerName: "Account",field:'accountName',maxWidth:180 },
      { headerName: 'Type', field: 'txnType',maxWidth:170 },
      { headerName: 'Transaction Date', field: 'txnDate',maxWidth:170 },
      { headerName: "Amount", field: 'amount',maxWidth:130 },
      { headerName: "Transfer/Cash",field:'transferType',maxWidth:170 },
      { headerName: "Txn Reference",field:'txnRef'},
      { headerName: 'Remarks', field: 'remarks' },
      { headerName: 'Status', field: 'status' },
      { headerName: "Created By", field: 'createdBy' },
      { headerName: 'Created At', field: 'createdAt',maxWidth:140  },
      { headerName: "Verified By", field: 'verifiedBy',maxWidth:140  },
      { headerName: 'Verified At', field: 'verifiedAt' },
    ]
    defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { textAlign: 'center' }
    }
    gridTxnOptions: GridOptions = {
      getRowId: (params) => params.data.id,
      defaultColDef: this.defaultColDef,
      rowModelType:'infinite',
      pagination: true,
      paginationPageSize: 10,
      cacheBlockSize:10,
      cacheOverflowSize:2,
      maxConcurrentDatasourceRequests:1,
      infiniteInitialRowCount:1,
      paginationPageSizeSelector:[10,25,50,100],
      context : { componentParent: this }
    }

    constructor(private dialog: MatDialog,private txnService:TransactionsService,private datePipe: DatePipe){}

    deleteTransaction(id:number){
      this.txnService.deleteTransactionById(id).subscribe(res=>{
        this.showSuccessDialog(res)
        this.searchTransactions()
      },err=>this.handleError(err))
    }
    async onTxnGridReady(params:any){
      this.txnGridApi=params.api;
      this.txnGridApi.hideOverlay();
    }
    onFromDateChange(event: any) {
      if(event.value){
        this.txnSearchDto.fromDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
      }else{
        this.txnSearchDto.fromDate = "";
      }
    }
    onToDateChange(event: any) {
      if(event.value)
        this.txnSearchDto.toDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
      else
        this.txnSearchDto.toDate =""
    }

    async searchTransactions(){
      let res=await this.txnService.searchCountTransactions(this.txnSearchDto).toPromise();
      res=res||{count:0};
      let datasource:IDatasource={
        getRows:(params:any)=>{
          if(res.count==0){
            params.successCallback([],0);
            this.txnGridApi.showNoRowsOverlay();
          }else{
            if(params.sortModel.length!=0){
              this.txnSearchDto.sortingCol = params.sortModel[0].colId;
              this.txnSearchDto.sortOrder = params.sortModel[0].sort;
            }
            this.txnSearchDto.pageSize = params.endRow - params.startRow;
            this.txnSearchDto.offset = params.startRow/this.txnSearchDto.pageSize;
            this.txnService.searchTransactions(this.txnSearchDto).subscribe(data => {
                params.successCallback(data, res.count);
                this.txnGridApi.autoSizeAllColumns();
                this.txnGridApi.hideOverlay();
                }, err => {
                  this.dialogEntity = new DialogEntity();
                  this.dialogEntity.message = err.error.message ? [err.error.message] : (err.status == 403 ? ["Access Denied"] : ["Unknown Error Occoured!"]);
                  this.dialogEntity.title = DialogType.ERROR;
                  this.dialogEntity.type = DialogType.ERROR;
                  this.dialog.open(ConfirmModalComponent, {
                    width: 'fit-content',
                    height: 'auto',
                    hasBackdrop: true,
                    maxHeight: '700px',
                    data: this.dialogEntity
                  });
                });            
          }
        }
      } 
      this.txnGridApi.setDatasource(datasource);
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
    }
}
