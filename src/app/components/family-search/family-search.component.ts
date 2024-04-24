import { Component, OnInit } from '@angular/core';
import { DropdownService } from '../../shared/services/dropdown.service';
import { Family, FamilySearch } from '../../models/family.model';
import { GridOptions,GridApi,ColumnApi,IDatasource } from 'ag-grid-community';
import { FamilyService } from '../../shared/services/family.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-search',
  templateUrl: './family-search.component.html',
  styleUrl: './family-search.component.scss'
})
export class FamilySearchComponent implements OnInit{
  
    gridApi!:GridApi;
    familySearchList:Family[]=[]
    
    constructor(public dropdownService:DropdownService,public familyService:FamilyService,private router:Router) { }
  
    async ngOnInit(): Promise<void> {
    }

    defaultColDef={
      sortable:false,
      filter:true,
      resizable:true,
      cellStyle:{textAlign:'center'}
    }
    gridColDef:any[]=[{headerName:'Unit Name',field:'unitName'},
    {headerName:'Family Id',field:'familyId'},
    {headerName:'Family Name',field:'familyName'},
    {headerName:'Classification',field:'classificationLabel'},
    {headerName:'Ward Number',field:'wardNumber'},
    {headerName:'Bank Ward Number',field:'bankWardNumber'},
    {headerName:'Post Office',field:'postOffice'},
    {headerName:'Pin Code',field:'pinCode'},
    {headerName:'Address',field:'permanentAddress'}]

    gridOptions:GridOptions={
      getRowId:(params)=>params.data.familyId,
      defaultColDef:this.defaultColDef,
      cacheBlockSize:10,
      paginationPageSize:10,
      rowModelType:'infinite',
      cacheOverflowSize:2,
      maxConcurrentDatasourceRequests:1,
      infiniteInitialRowCount:1,
      paginationPageSizeSelector:[10,25,50,100],
      onRowClicked:(params)=>{
        this.familyService.familyIdToView=params.data.familyId;
        this.router.navigate(['/view-family'])
      }
    }
    async onGridReady(params:any){
      this.gridApi=params.api;
      this.gridApi.hideOverlay();
      this.gridApi.autoSizeAllColumns();
    }

    familySearch:FamilySearch = new FamilySearch();

    async searchFamily(){
      var noOfCount:{count:0}|undefined={count:0};
      this.gridApi.showLoadingOverlay();
      noOfCount=await this.familyService.countSearchFamily(this.familySearch).toPromise();
      this.familyService.totalRows=noOfCount?noOfCount.count:0;
      var dataSource:IDatasource={
        getRows:(params)=>{
          this.gridApi.showLoadingOverlay();
          if(this.familyService.totalRows==0){
            params.successCallback([],0);
            this.gridApi.showNoRowsOverlay();
          }else{
            this.familySearch.offset=params.startRow;
            this.familySearch.pageSize=params.endRow-params.startRow;
            if(params.sortModel.length!=0){
              this.familySearch.sortBy=params.sortModel[0].colId;
              this.familySearch.sortOrder=params.sortModel[0].sort;
            }
            this.familyService.searchFamily(this.familySearch).subscribe((data:Family[])=>{
              data.forEach(d=>{
                d.unitName=this.dropdownService.unitmap[d.unitId];
                d.classificationLabel=this.dropdownService.classificationMap[d.classification];
              })
              params.successCallback(data, this.familyService.totalRows);
              this.gridApi.autoSizeAllColumns();
              this.gridApi.hideOverlay();
            })
          }
        }
      }
      this.gridApi.setDatasource(dataSource);
    }
}
