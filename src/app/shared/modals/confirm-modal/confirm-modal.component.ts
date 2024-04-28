import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogEntity, DialogType } from '../../../models/modals.model';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit {

  iconValue: string = "";
  colorValue: string = "";

  okButtonFunction = (): void => { };
  cancelButtonFunction = (): void => { }

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogEntity) { }

  ngOnInit(): void {
    if (this.dialogData) {
      this.getIcon();
    }
  }

  close() {
    if (this.cancelButtonFunction)
      this.cancelButtonFunction();
  }

  confirm() {
    this.dialogData.okayButtonHandler();
  }

  getIcon() {
    if (this.dialogData.type == DialogType.INFO) {
      this.iconValue = "info";
      this.colorValue = "#03A9F4";
    }
    else if (this.dialogData.type == DialogType.WARNING) {
      this.iconValue = "warning";
      this.colorValue = "#FF5722";
    }
    else if (this.dialogData.type == DialogType.ERROR) {
      this.iconValue = "error";
      this.colorValue = "#F44336";
    }
    else if (this.dialogData.type == DialogType.SUCCESS) {
      this.iconValue = "check_circle";
      this.colorValue = "#4CAF50";
    }
    else if (this.dialogData.type == DialogType.CONFIRM) {
      this.iconValue = "help";
      this.colorValue = "#03A9F4";
    }
    else {
      this.iconValue = "";
      this.colorValue = "primary";
    }
  }

}
