import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

export interface updateData{
  base64: any;


}

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentViewComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData, public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

  imageConvert(vehicleImg): any {
    if (vehicleImg != null) {
      return this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + vehicleImg);
    } else {
      return '/assets/sample-car-imgs/placeholder.png';
    }
  }


}
