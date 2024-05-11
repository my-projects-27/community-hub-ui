import { Component } from '@angular/core';
import { GridOptions,GridApi,IDatasource } from 'ag-grid-community';
import { TransactionsService } from '../../shared/services/transactions.service';
import { TXnsProcessDto, TransactionSearchDto } from '../../models/transaction.model';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { CustomSelectRendererComponent } from '../../shared/custom-select-renderer/custom-select-renderer.component';
import { CustomTextRendererComponent } from '../../shared/custom-text-renderer/custom-text-renderer.component';

@Component({
  selector: 'app-txn-approvals',
  templateUrl: './txn-approvals.component.html',
  styleUrl: './txn-approvals.component.scss'
})
export class TxnApprovalsComponent {

  txnGridApi!:GridApi;
  dialogEntity: DialogEntity = new DialogEntity();

  constructor(private dialog: MatDialog,private txnService:TransactionsService){}
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { textAlign: 'center' }
  }
  gridColTxnDef: any[] = [
//    { headerName:"Action",field: 'status',cellEditor: 'agSelectCellEditor',cellEditorParams: {values: ['PENDING', 'APPROVED', 'REJECTED']},editable:true},
    {headerName:"Action",field: 'status',cellRenderer: CustomSelectRendererComponent,maxWidth:180,cellStyle:{'align-content':'center'},'user-select':'none'},
    {headerName:"Any Remarks",field: 'newRemarks',cellRenderer: CustomTextRendererComponent,maxWidth:180,cellStyle:{'align-content':'center','user-select':'none'}},
    // { headerName: "Any Remarks",cellEditor: 'agTextCellEditor',field: 'newRemarks',editable:true },
    { headerName: 'Transaction ID', field: 'id',maxWidth:180  },
    { headerName: "Account",field:'accountName',maxWidth:180 },
    { headerName: "Amount (Rs)", field: 'amount', type: ['numericColumn', 'shaded'],maxWidth:150 },
    { headerName: 'Type', field: 'txnType',maxWidth:170 },
    { headerName: 'Transaction Date', field: 'txnDate',maxWidth:170 },
    { headerName: "Transfer/Cash",field:'transferType',maxWidth:170 },
    { headerName: "Family Name",field:'familyName',maxWidth:170},
    { headerName: "Txn Reference",field:'txnRef'},
    { headerName: 'Remarks', field: 'remarks' },
    { headerName: "Created By", field: 'createdBy' },
    { headerName: 'Created At', field: 'createdAt',maxWidth:140  },
  ]
  gridTxnOptions: GridOptions = {
    getRowId: (params) => params.data.id,
    suppressCellFocus: true,
    defaultColDef: this.defaultColDef,
    rowModelType:'infinite',
    pagination: true,
    paginationPageSize: 10,
    cacheBlockSize:10,
    cacheOverflowSize:2,
    maxConcurrentDatasourceRequests:1,
    infiniteInitialRowCount:1,
    paginationPageSizeSelector:[10,25,50,100],
  }
  onTxnGridReady(params:any){
    this.txnGridApi=params.api;
    this.txnGridApi.showLoadingOverlay();
    this.getPendingTransactions();
  }

  approve(){
    let txnsToBeProcessed:TXnsProcessDto[]=[];
    let gridData=this.txnGridApi.getRenderedNodes()
    let renderIns:any=this.txnGridApi.getCellRendererInstances();
    for(let i=0;i<renderIns.length;i+=2){
      let txn=new TXnsProcessDto()
      txn.status=renderIns[i].value;
      if(txn.status=="PENDING")
        continue
      txn.transactionId=gridData[i/2].data.id
      txn.remarks=renderIns[i+1].value;
      txnsToBeProcessed.push(txn);
    }
    if(txnsToBeProcessed.length!=0){
        this.txnService.processTransactions(txnsToBeProcessed).subscribe(rs=>{
        this.dialogEntity = new DialogEntity();
        this.dialogEntity.message = rs.message;
        this.dialogEntity.title = DialogType.INFO;
        this.dialogEntity.type = DialogType.INFO;
        this.dialog.open(ConfirmModalComponent, {
          width: 'fit-content',
          height: 'auto',
          hasBackdrop: true,
          maxHeight: '700px',
          data: this.dialogEntity
        });
        this.getPendingTransactions();
        })
    }else{
        this.dialogEntity = new DialogEntity();
        this.dialogEntity.message = ["Please select atleast one transaction to approve!"];
        this.dialogEntity.title = DialogType.INFO;
        this.dialogEntity.type = DialogType.INFO;
        this.dialog.open(ConfirmModalComponent, {
          width: 'fit-content',
          height: 'auto',
          hasBackdrop: true,
          maxHeight: '700px',
          data: this.dialogEntity
        });
    }
  }

  async getPendingTransactions(){
    let searchCountDto:TransactionSearchDto = new TransactionSearchDto();
    searchCountDto.status = "PENDING";
    searchCountDto.sameUserFilter=true;
    let res=await this.txnService.searchCountTransactions(searchCountDto).toPromise();
    res=res||{count:0};
    let datasource:IDatasource={
      getRows:(params:any)=>{
        if(res.count==0){
          params.successCallback([],0);
          this.txnGridApi.hideOverlay()
          this.txnGridApi.showNoRowsOverlay();
        }else{
          let searchDto:TransactionSearchDto = new TransactionSearchDto();
          searchDto.status = "PENDING";
          searchDto.sameUserFilter=true;
          if(params.sortModel.length!=0){
            searchDto.sortingCol = params.sortModel[0].colId;
            searchDto.sortOrder = params.sortModel[0].sort;
          }
          searchDto.pageSize = params.endRow - params.startRow;
          searchDto.offset = params.startRow/searchDto.pageSize;
          this.txnService.searchTransactions(searchDto).subscribe(data => {
              this.txnGridApi.hideOverlay();
              params.successCallback(data, res.count);
              this.txnGridApi.autoSizeAllColumns();
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
                this.txnGridApi.hideOverlay()
              });            
        }
      }
    } 
  this.txnGridApi.setDatasource(datasource);
  }
}
