import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



// tslint:disable-next-line:class-name
export interface updateData{
  newPhase: any;
  oldPhase: any;

}

@Component({
  selector: 'app-phase-confirmation-dialog',
  templateUrl: './phase-confirmation-dialog.component.html',
  styleUrls: ['./phase-confirmation-dialog.component.scss']
})
export class PhaseConfirmationDialogComponent implements OnInit {

  @Output() onUpdate = new EventEmitter();
  @Input() loader = false;




  constructor(public dialogRef: MatDialogRef<PhaseConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData) { }

  ngOnInit(): void {

    console.log(this.data);
  }

  update(): void{
    this.onUpdate.emit('000');
    this.loader = true;
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

}
