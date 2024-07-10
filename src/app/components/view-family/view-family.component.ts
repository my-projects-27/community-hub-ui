import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../../shared/services/family.service';
import { DuesSearchDto, Family } from '../../models/family.model';
import { GridOptions,GridApi } from 'ag-grid-community';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { DropdownService } from '../../shared/services/dropdown.service';
import { Router } from '@angular/router';
import {IDatasource} from 'ag-grid-community';
import { TransactionsService } from '../../shared/services/transactions.service';
import { TransactionSearchDto } from '../../models/transaction.model';
import { CreateDuesComponent } from '../create-dues/create-dues.component';
import { CustomButtonRendererComponent } from '../../shared/custom-button-renderer/custom-button-renderer.component';
import { CustomResponse, ResponseType } from '../../models/config.model';

@Component({
  selector: 'app-view-family',
  templateUrl: './view-family.component.html',
  styleUrl: './view-family.component.scss'
})
export class ViewFamilyComponent implements OnInit {

  gridApi!:GridApi;
  txnGridApi!:GridApi;
  duesGridApi!:GridApi;
  familyId: string = '';
  family: Family = new Family();
  dialogEntity: DialogEntity = new DialogEntity();
  selectedTab: number = 0;
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { textAlign: 'center' }
  }
  gridColDef: any[] = [{ headerName: 'Name', field: 'name' },
  { headerName: 'Primary Number', field: 'primaryNumber',maxWidth:170 },
  { headerName: 'Secondary Number', field: 'secondaryNumber',maxWidth:170 },
  { headerName: "WhatsApp Number", field: 'whatsAppNumber',maxWidth:170 },
  { headerName: "Mode of Contact", field: 'modeOfContact' },
  { headerName: "Primary Member",field:'isPrimary',cellDataType:'boolean',maxWidth:170 },
  { headerName: "Primary Contact",field:'isPrimaryContact',cellDataType:'boolean',maxWidth:180 },
  { headerName: "Primary Whatsapp",field:'isPrimaryWhatsApp',cellDataType:'boolean',maxWidth:180 },
  { headerName: 'Occupation', field: 'occupation' },
  { headerName: 'Relationship', field: 'relationWithPrimary' },
  { headerName: "Present Location", field: 'presentLocation' },
  { headerName: 'Email', field: 'email',maxWidth:200  },
  { headerName: "Aadhar Number", field: 'adhaarNumber',maxWidth:200  },
  { headerName: 'Age',valueGetter:(params:any)=>params.data.dateOfBirth?this.calulateAge(params.data.dateOfBirth):'',maxWidth:80},
  { headerName: 'Name In Malyalam', field: 'nameInLocal' },
  { headerName: "Blood Group", field: 'bloodGroup',maxWidth:180  },
  ]
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
  gridColDuesDef: any[] = [
    { headerName: "Delete", cellRenderer: CustomButtonRendererComponent, cellStyle: (params:any) =>{return {'margin-top':'5px'}},maxWidth:100},
    { headerName: 'Dues ID', field: 'id',maxWidth:130  },
    { headerName: "Account",field:'accountName' },
    { headerName: "Amount", field: 'amount',maxWidth:130 },
    { headerName: 'Due Date', field: 'date',maxWidth:170 },
    { headerName: 'description', field: 'description' },
    { headerName: "Created By", field: 'createdBy' },
    { headerName: 'Created At', field: 'createdAt',maxWidth:140  },
    
  ]

  gridOptions: GridOptions = {
    getRowId: (params) => params.data.memberId,
    defaultColDef: this.defaultColDef,
  }
  gridTxnOptions: GridOptions = {
    getRowId: (params) => params.data.id,
    defaultColDef: this.defaultColDef,
    rowModelType:'infinite',
    pagination: true,
    paginationPageSize: 10,
    cacheOverflowSize:2,
    cacheBlockSize:10,
    maxConcurrentDatasourceRequests:1,
    infiniteInitialRowCount:1,
    paginationPageSizeSelector:[10,25,50,100],
    context : { componentParent: this }
  }
  gridDuesOptions: GridOptions = {
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
  constructor(public familyService: FamilyService,private txnService:TransactionsService, private dialog: MatDialog, public dropdownService: DropdownService,private router:Router) {
  }

  ngOnInit(): void {
    this.familyId = this.familyService.familyIdToView;
    this.familyService.familyIdToView=""
    if (this.familyId) {
      this.searchFamily();
    }
  }

  
  deleteTransaction(id:number){
    if(this.selectedTab==1){
      this.txnService.deleteTransactionById(id).subscribe(res=>{
        this.showSuccessDialog(res)
        this.onTabChanged()
      },err=>this.handleError(err))
    }else if(this.selectedTab==2){
      this.familyService.deleteFamilyDueById(id).subscribe(res=>{
        this.showSuccessDialog(res)
        this.onTabChanged()
      },err=>this.handleError(err))
    }
  }

  addDues(){
    if(this.family.familyId){
      this.dialog.open(CreateDuesComponent, {
        width: '400px',
        data: {familyId:this.family.familyId}
      });
    }
  }

  async onGridReady(params:any){
    this.gridApi=params.api;
    this.gridApi.autoSizeAllColumns();
  }
  async onTxnGridReady(params:any){
    this.txnGridApi=params.api;
    this.txnGridApi.hideOverlay();
    this.txnGridApi.sizeColumnsToFit();
  }
  async onDuesGridReady(params:any){
    this.duesGridApi=params.api;
    this.duesGridApi.hideOverlay();
    this.duesGridApi.sizeColumnsToFit();
  }

  searchFamily() {
    if (!this.familyId)
      return;
    this.familyService.getFamilyById(this.familyId).subscribe((data: Family) => {
      this.family = data;
      if(this.dropdownService.branchList&&this.dropdownService.branchList.length>0)
        this.family.branchId=this.dropdownService.branchList[0].id;
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
      }).afterClosed().subscribe(res=>this.selectedTab=2);
    });
  }

  calulateAge(dateOfBirth: string):number {
    var dob = new Date(dateOfBirth);   
    var age_dt = new Date(Date.now() - dob.getTime());  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  updateFamily(){
    this.familyService.familyToUpdate=this.family;
    this.familyService.familyToUpdate.newFamily=false;
    this.router.navigate(['/create-family']);
  }

  async onTabChanged() {
    if(!this.familyId)
      return;
    if(this.selectedTab==1){
      let searchCountDto:TransactionSearchDto = new TransactionSearchDto();
      searchCountDto.familyCode = this.familyId;
      let res=await this.txnService.searchCountTransactions(searchCountDto).toPromise();
      res=res||{count:0};
      let datasource:IDatasource={
        getRows:(params:any)=>{
          if(res.count==0){
            params.successCallback([],0);
            this.txnGridApi.showNoRowsOverlay();
          }else{
            let searchDto:TransactionSearchDto = new TransactionSearchDto();
            searchDto.familyCode = this.familyId;
            if(params.sortModel.length!=0){
              searchDto.sortingCol = params.sortModel[0].colId;
              searchDto.sortOrder = params.sortModel[0].sort;
            }
            searchDto.pageSize = params.endRow - params.startRow;
            searchDto.offset = params.startRow/searchDto.pageSize;
            this.txnService.searchTransactions(searchDto).subscribe(data => {
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
    }else if(this.selectedTab==2){
      let searchCountDto:DuesSearchDto = new DuesSearchDto();
      searchCountDto.familyId = this.familyId;
      let res=await this.familyService.countSearchFamilyDues(searchCountDto).toPromise();
      res=res||{count:0};
      let datasource:IDatasource={
        getRows:(params:any)=>{
          if(res.count==0){
            params.successCallback([],0);
            this.duesGridApi.showNoRowsOverlay();
          }else{
            let searchDto:DuesSearchDto = new DuesSearchDto();
            searchDto.familyId = this.familyId;
            if(params.sortModel.length!=0){
              searchDto.sortBy = params.sortModel[0].colId;
              searchDto.sortOrder = params.sortModel[0].sort;
            }
            searchDto.pageSize = params.endRow - params.startRow;
            searchDto.offset = params.startRow/searchDto.pageSize;
            this.familyService.searchFamilyDues(searchDto).subscribe(data => {
                params.successCallback(data, res.count);
                this.duesGridApi.sizeColumnsToFit();
                this.duesGridApi.hideOverlay();
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
      this.duesGridApi.setDatasource(datasource);
    }
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
