import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-create-confirmation',
  templateUrl: './create-confirmation.component.html',
  styleUrls: ['./create-confirmation.component.scss']
})
export class CreateConfirmationComponent implements OnInit {

  @Output() onCreate = new EventEmitter();
  @Input() loader = false;

  constructor(public dialogRef: MatDialogRef<CreateConfirmationComponent>) { }

  ngOnInit() {
  }

  save(): void{
    this.onCreate.emit('000');
    this.loader = true;
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

}
