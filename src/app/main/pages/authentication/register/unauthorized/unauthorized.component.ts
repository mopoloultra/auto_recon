import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UnauthorizedComponent>, public router: Router) { }

  ngOnInit() {
  }

  closeDialog(): void{
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

}
