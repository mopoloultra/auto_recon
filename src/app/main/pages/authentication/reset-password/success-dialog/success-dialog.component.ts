import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>, public router: Router) { }

  ngOnInit() {
  }

  closeDialog(): void{
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}

