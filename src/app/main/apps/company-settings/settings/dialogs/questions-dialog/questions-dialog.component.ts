import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {UsersService} from '../../../../../../services/users.service';
import {SettingsService} from '../../../settings.service';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {HttpErrorResponse} from '@angular/common/http';
import {Questions} from '../../../../../models/settings/Questions';


export interface QuestionsData {
  vendorTypeList: any;
  inspectionMultipointQuestionTypes: any;
  companyID: any;
  name: any;
  description: any;
  position: any;
  isActiveFlag: any;
  TypeID: any;
  isCreateSubletItemOnFail: any;
  companyVendorType: any;
  InspectionMultipointQuestionID: any;
  createdByUserName: any;
  createdByUserID: any;
}

@Component({
  selector: 'app-questions-dialog',
  templateUrl: './questions-dialog.component.html',
  styleUrls: ['./questions-dialog.component.scss']
})
export class QuestionsDialogComponent implements OnInit {

  addTagFormGroup: FormGroup;
  public hostHeaderInfo: hostHeaderInfo;
  public Questions: any;
  loader = false;
  @Output() onSucess = new EventEmitter();
  resp: any;

  constructor(
      private _formBuilder: FormBuilder,
      private settingsService: SettingsService,
      public usersService: UsersService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<QuestionsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: QuestionsData
  ) {
    this.hostHeaderInfo = new hostHeaderInfo();
  }

  ngOnInit(): void {
  }

  save(): void{
    this.loader = true;


    this.Questions = this.data;
    this.Questions.hostHeaderInfo = this.hostHeaderInfo;



    this.settingsService.saveInspectionMultipointQuestionAdmin(this.Questions).subscribe( res => {
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

  close(): void{
    this.dialogRef.close();
  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

}
