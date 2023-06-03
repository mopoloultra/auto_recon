import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, NgModel, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {UsersService} from '../../../../../../services/users.service';
import {SettingsService} from '../../../settings.service';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';

export interface QuestionsData {
  vendorTypeList: Array<any>;
  vendorType: any;
  companyVendorID: any;
  companyID: any;
  name: any;
  contact: any;
  email: any;
  isActiveFlag: boolean;
  address: any;
  createdByUserID: any;
  vendorTypeIDs: Array<any>;
}

@Component({
  selector: 'app-vendor-dialog',
  templateUrl: './vendor-dialog.component.html',
  styleUrls: ['./vendor-dialog.component.scss']
})
export class VendorDialogComponent implements OnInit {

  public hostHeaderInfo: hostHeaderInfo;
  Questions: any;
  loader = false;
  @Output() onSucess = new EventEmitter();
  resp: any;


  constructor(
      private _formBuilder: FormBuilder,
      private settingsService: SettingsService,
      public usersService: UsersService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<VendorDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: QuestionsData
  ) {
    this.hostHeaderInfo = new hostHeaderInfo();

  }

  ngOnInit(): void {

    this.data.vendorTypeList.forEach(function(v){ delete v.companyID});

    if(this.data.vendorType.length > 0){
      this.data.vendorType.forEach(function(v){ delete v.companyID});
    }

    console.log(this.data.vendorTypeList)
    console.log(this.data.vendorType)
  }

  save(): void{



    let dataOBJ = {
      hostHeaderInfo: this.hostHeaderInfo,
      companyVendorID: '',
      companyID: '',
      name: '',
      contact: '',
      email: '',
      isActiveFlag: true,
      address: '',
      createdByUserID: '',
      vendorTypeIDs: []
    };
    const count = this.data.vendorType.length;
    for (let i = 0; i < count; i++){
      this.data.vendorTypeIDs.push(this.data.vendorType[i].id);
    }
    this.loader = true;


    dataOBJ.companyVendorID = this.data.companyVendorID;
    dataOBJ.companyID = this.data.companyID;
    dataOBJ.name = this.data.name;
    dataOBJ.contact = this.data.contact;
    dataOBJ.email = this.data.email;
    dataOBJ.isActiveFlag = true;
    dataOBJ.address = this.data.address;
    dataOBJ.createdByUserID  = this.data.createdByUserID;
    dataOBJ.vendorTypeIDs  = this.data.vendorTypeIDs;



    this.settingsService.saveUpdateCompanyVendor(dataOBJ).subscribe( res => {
      this.resp = res;
      if (this.resp.hostHeaderInfo.responseCode === '000'){
        this.onSucess.emit('000');
        this.showToast('SUCCESS');
        this.dialogRef.close();
      }else{
        this.showToast(this.resp.hostHeaderInfo.responseMessage);
        this.loader = false;

      }
    });
  }

  equals(objOne, objTwo): boolean {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.viewValue === objTwo.viewValue;
    }
  }



  close(): void{
    this.dialogRef.close();
  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

}
