import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-button-renderer',
  template: '<mat-icon color="accent" style="cursor: pointer;" (click)="deleteTransaction()">delete</mat-icon>',
})
export class CustomButtonRendererComponent implements ICellRendererAngularComp{
  params: any;
  agInit(params: any): void {
    this.params=params;
  }
  refresh(params: any): boolean {
    return true;
  }

  deleteTransaction(){
    this.params.context.componentParent.deleteTransaction(this.params.data.id);
  }
}
