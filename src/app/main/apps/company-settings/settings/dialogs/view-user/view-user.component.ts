import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  userData: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, public dialofRef: MatDialogRef<ViewUserComponent>) {
    this.userData = data.userData;

  }

  ngOnInit() {

  }

  close(){
    this.dialofRef.close();
  }

}

