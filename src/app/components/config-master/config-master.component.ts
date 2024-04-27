import { Component, OnInit } from '@angular/core';
import { Branch, CommonReference, ConfigEntity, CustomResponse, ResponseType, Union, Unit } from '../../models/config.model';
import { DropdownObject, staticTypes } from '../../models/dropdown.model';
import { DropdownService } from '../../shared/services/dropdown.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

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
  configEntity:ConfigEntity = new ConfigEntity();
  parentList:DropdownObject[] = [];
  selectedEntity:string = "Union";

  dialogEntity: DialogEntity = new DialogEntity();
  staticTypes:DropdownObject[]= staticTypes;

  constructor(private dropdownService:DropdownService,private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  selectEntity(){
    if(this.selectedEntity == "Union"){
      this.parentList = [];
    }else if(this.selectedEntity == "Branch"){
      this.parentList = this.dropdownService.unionList;
    }else{
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
      });
    }else if(this.selectedEntity == "Branch"){
      this.branch.branchName = this.configEntity.name;
      this.branch.branchNameLocal = this.configEntity.nameLocal;
      this.branch.unionId = this.configEntity.parentId;
      this.dropdownService.saveBranches(this.branch).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      });
    }else if(this.selectedEntity == "Unit"){
      this.unit.unitName = this.configEntity.name;
      this.unit.unitNameLocal = this.configEntity.nameLocal;
      this.unit.branchId = this.configEntity.parentId;
      this.dropdownService.saveUnits(this.unit).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      });
    }else{
      this.dropdownReference.code = this.configEntity.code;
      this.dropdownReference.type = this.configEntity.type;
      this.dropdownReference.value = this.configEntity.name;
      this.dropdownReference.valueLocal = this.configEntity.nameLocal;
      this.dropdownService.saveStaticDropdowns(this.dropdownReference).subscribe((res)=>{
        this.showSuccessDialog(res);
        this.dropdownService.getDropdowns();
      },err=>{
        this.dialogEntity = new DialogEntity();
        this.dialogEntity.message = err.error.message? err.error.message : (err.status==403?"Access Denied":"Unknown Error Occoured!");
        this.dialogEntity.title = err.error.responseType=="FORM_VALIDATION_ERROR"?DialogType.FORM_VALIDATION_ERROR:DialogType.ERROR;
        this.dialogEntity.type = DialogType.ERROR;
        this.dialog.open(ConfirmModalComponent, {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          hasBackdrop: true,
          maxHeight: '700px',
          data: this.dialogEntity
        });
      });
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
}
