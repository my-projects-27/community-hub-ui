import { Component, OnInit } from '@angular/core';
import { Family, Member } from '../../models/family.model';
import { DropdownService } from '../../shared/services/dropdown.service';
import { FamilyService } from '../../shared/services/family.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomResponse, ResponseType } from '../../models/config.model';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { DropdownObject } from '../../models/dropdown.model';
import { Console } from 'console';

@Component({
  selector: 'app-create-family',
  templateUrl: './create-family.component.html',
  styleUrl: './create-family.component.scss'
})
export class CreateFamilyComponent implements OnInit{

  family:Family=new Family();
  selectedMember:number=0;
  sameAsCurrent:boolean=false;
  dialogEntity: DialogEntity = new DialogEntity();

  isUpdate:boolean=false;

  constructor(public dropdownService:DropdownService,public familyService:FamilyService,private dialog: MatDialog) { 
  }
  
  ngOnInit(): void {
    if(this.familyService.familyToUpdate.familyId){
      this.family=this.familyService.familyToUpdate;
      this.isUpdate=true;
      this.familyService.familyToUpdate=new Family();
    }else{
      let mem=new Member();
      this.family.members.push(mem);
    }
    if(this.dropdownService.branchList&&this.dropdownService.branchList.length>0)
      this.family.branchId=this.dropdownService.branchList[0].id;
  }

  addMember(){
    let mem=new Member();
    this.family.members.push(mem);
    this.selectedMember++;
  }

  onSameAsCurrentChange(){
    if(this.sameAsCurrent){
      this.family.currentAddress=this.family.permanentAddress;
      this.family.currentAddressLocal=this.family.permanentAddressLocal;
    }else{
      this.family.currentAddress="";
      this.family.currentAddressLocal="";
    }
  }

  saveFamily(){
    this.familyService.saveFamily(this.family).subscribe((res) => {
      this.showSuccessDialog(res);
    },err=>{
      this.dialogEntity = new DialogEntity();
      this.dialogEntity.message = err.error.message? err.error.message : (err.status==403?["Access Denied"]:["Unknown Error Occoured!"]);
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
    this.openDialog();
    this.family=new Family();
    this.family.members.push(new Member());
    this.selectedMember=0;
    this.sameAsCurrent=false;
  }
  removeMember(i:number){
    this.dialogEntity = new DialogEntity();
    this.dialogEntity.message = ["Are You Sure You Want To Remove This Member?"];
    this.dialogEntity.title = DialogType.CONFIRM;
    this.dialogEntity.type = DialogType.CONFIRM;
    this.dialogEntity.textCancelButton="No";
    this.dialogEntity.textOkayButton="Yes";
    this.dialogEntity.okayButtonHandler=this.removeMemberConfirmed.bind(this,i);
    this.openDialog();
  }

  removeMemberConfirmed(i:number){
    this.family.members.splice(i,1);
    this.selectedMember=this.selectedMember==0?0:this.selectedMember-1;
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
