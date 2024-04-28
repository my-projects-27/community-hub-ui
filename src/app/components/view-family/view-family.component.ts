import { Component, OnInit } from '@angular/core';
import { FamilyService } from '../../shared/services/family.service';
import { Family } from '../../models/family.model';
import { GridOptions,GridApi } from 'ag-grid-community';
import { DialogEntity, DialogType } from '../../models/modals.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { DropdownService } from '../../shared/services/dropdown.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-family',
  templateUrl: './view-family.component.html',
  styleUrl: './view-family.component.scss'
})
export class ViewFamilyComponent implements OnInit {

  gridApi!:GridApi;
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
  gridOptions: GridOptions = {
    getRowId: (params) => params.data.memberId,
    defaultColDef: this.defaultColDef,
  }

  constructor(public familyService: FamilyService, private dialog: MatDialog, public dropdownService: DropdownService,private router:Router) {
  }
  ngOnInit(): void {
    this.familyId = this.familyService.familyIdToView;
    this.familyService.familyIdToView=""
    if (this.familyId) {
      this.searchFamily();
    }
  }

  async onGridReady(params:any){
    this.gridApi=params.api;
    this.gridApi.autoSizeAllColumns();
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
      });
    });
  }

  calulateAge(dateOfBirth: string):number {
    console.log(dateOfBirth);
    var dob = new Date(dateOfBirth);   
    var age_dt = new Date(Date.now() - dob.getTime());  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  updateFamily(){
    this.familyService.familyToUpdate=this.family;
    this.router.navigate(['/create-family']);
  }
}
