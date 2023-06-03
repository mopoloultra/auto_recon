import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

export interface updateData{
  vehicleID: any;


}

@Component({
  selector: 'app-activities-dialog',
  templateUrl: './activities-dialog.component.html',
  styleUrls: ['./activities-dialog.component.scss']
})
export class ActivitiesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ActivitiesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData) { }

  ngOnInit() {
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

}
