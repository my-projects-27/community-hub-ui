import { ErrorHandler, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogEntity, DialogType } from "../../models/modals.model";
import { ConfirmModalComponent } from "../modals/confirm-modal/confirm-modal.component";

@Injectable({
    providedIn: 'root'
})
export class MyErrorHandler {

  dialogEntity: DialogEntity=new DialogEntity();

  constructor(private dialog:MatDialog) { }
  
  handleError(err: any) {

  }
}