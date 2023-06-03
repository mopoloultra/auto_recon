import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA ,MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-company-user-view',
  templateUrl: './company-user-view.component.html',
  styleUrls: ['./company-user-view.component.scss']
})
export class CompanyUserViewComponent implements OnInit {

  compUserData: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, public dialofRef: MatDialogRef<CompanyUserViewComponent>) {
    this.compUserData = data.compData;

  }

  ngOnInit() {

  }

  close(){
    this.dialofRef.close();
  }
}
