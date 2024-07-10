import { Component, OnInit } from '@angular/core';
import { Branch, CommonReference, ConfigEntity, CustomResponse, ResponseType, Union, Unit } from '../../models/config.model';
import { DropdownObject, staticTypes } from '../../models/dropdown.model';
import { DropdownService } from '../../shared/services/dropdown.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { AccountsService } from '../../shared/services/accounts.service';
import { AccountHead } from '../../models/accounts.model';

@Component({
  selector: 'app-config-master',
  templateUrl: './config-master.component.html',
  styleUrl: './config-master.component.scss'
})
export class ConfigMasterComponent implements OnInit{
  
  union:Union = new Union();
  branch:Branch = new Branch();
  unit:Unit = new Unit();
  dropdownReference:CommonReference = new CommonReference();
  accountHead:AccountHead = new AccountHead();
  configEntity:ConfigEntity = new ConfigEntity();
  parentList:DropdownObject[] = [];
  selectedEntity:string = "Union";

  dialogEntity: DialogEntity = new DialogEntity();
  staticTypes:DropdownObject[]= staticTypes;
  txnTypes:string[]=["PAYMENT","RECEIPT","BOTH"];

  constructor(private dropdownService:DropdownService,private dialog: MatDialog,private accountService:AccountsService) { }

  ngOnInit(): void {
  }

  selectEntity(){
    if(this.selectedEntity == "Union"){
      this.parentList = [];
    }else if(this.selectedEntity == "Branch"){
      this.parentList = this.dropdownService.unionList;
    }else if(this.selectedEntity == "Unit"){
      this.parentList = this.dropdownService.branchList;
    }
  }

  saveEntity(){
    if(this.selectedEntity == "Union"){
      this.union.unionName = this.configEntity.name;
      this.union.unionNameLocal = this.configEntity.nameLocal;
      this.dropdownService.saveUnions(this.union).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      },err=>this.handleError(err));
    }else if(this.selectedEntity == "Branch"){
      this.branch.branchName = this.configEntity.name;
      this.branch.branchNameLocal = this.configEntity.nameLocal;
      this.branch.unionId = this.configEntity.parentId;
      this.dropdownService.saveBranches(this.branch).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      },err=>this.handleError(err));
    }else if(this.selectedEntity == "Unit"){
      this.unit.unitName = this.configEntity.name;
      this.unit.unitNameLocal = this.configEntity.nameLocal;
      this.unit.branchId = this.configEntity.parentId;
      this.dropdownService.saveUnits(this.unit).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      },err=>this.handleError(err));
    }else if(this.selectedEntity == "staticType"){
      this.dropdownReference.code = this.configEntity.code;
      this.dropdownReference.type = this.configEntity.type;
      this.dropdownReference.value = this.configEntity.name;
      this.dropdownReference.valueLocal = this.configEntity.nameLocal;
      this.dropdownService.saveStaticDropdowns(this.dropdownReference).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      },err=>this.handleError(err));
    }else if(this.selectedEntity == "accountHead"){
      this.accountHead=new AccountHead();
      this.accountHead.code=this.configEntity.code;
      this.accountHead.name=this.configEntity.name;
      this.accountHead.nameLocal=this.configEntity.nameLocal;
      this.accountHead.type=this.configEntity.type;
      this.accountHead.familyTxnAllowed=this.configEntity.familyTxnAllowed;
      this.accountService.saveAccount(this.accountHead).subscribe((res)=>{
        this.showSuccessDialog(res);
      },err=>this.handleError(err));
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
    this.configEntity=new ConfigEntity();
  }

  handleError(err:any){
    this.dialogEntity = new DialogEntity();
    if(err.status==403){
      this.dialogEntity.message = ["Access Denied"];
    }else{
      this.dialogEntity.message = [err.error&&err.error.message? err.error.message : "Unknown Error Occoured!"];
    }
    this.dialogEntity.title = err.error&&err.error.responseType=="FORM_VALIDATION_ERROR"?DialogType.FORM_VALIDATION_ERROR:DialogType.ERROR;
    this.dialogEntity.type = DialogType.ERROR;
    this.dialog.open(ConfirmModalComponent, {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      data: this.dialogEntity
    });
  }
}
