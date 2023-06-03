import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA ,MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss']
})
export class ViewCompanyComponent implements OnInit {

  companyData: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, public dialofRef: MatDialogRef<ViewCompanyComponent>) {
    this.companyData = data.compData;
    console.log(this.companyData);

  }

  ngOnInit() {

  }

  close(){
    this.dialofRef.close();
  }

}
