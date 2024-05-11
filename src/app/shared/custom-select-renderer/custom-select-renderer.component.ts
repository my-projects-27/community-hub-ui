import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-select-renderer',
  templateUrl: './custom-select-renderer.component.html'
})
export class CustomSelectRendererComponent implements ICellRendererAngularComp{
  listValues:string[]= ['PENDING', 'APPROVED', 'REJECTED']
  public value: any;
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.value = params.value;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.value = params.value;
    return true;
  }
}
