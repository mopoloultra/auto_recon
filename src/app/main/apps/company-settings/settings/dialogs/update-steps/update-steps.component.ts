import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {UsersService} from '../../../../../../services/users.service';
import {SettingsService} from '../../../settings.service';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {HttpErrorResponse} from '@angular/common/http';
import {StepsData} from '../../../../../models/settings/StepsData';



export interface StepsInfo {
  data: any;
  compID: any;
}


@Component({
  selector: 'app-update-steps',
  templateUrl: './update-steps.component.html',
  styleUrls: ['./update-steps.component.scss']
})
export class UpdateStepsComponent implements OnInit {

  public hostHeaderInfo: hostHeaderInfo;
  public StepsData: StepsData;
  stepsFormGroup: FormGroup;
  loader = false;
  @Output() onSucess = new EventEmitter();


  constructor(
      private _formBuilder: FormBuilder,
      private settingsService: SettingsService,
      public usersService: UsersService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<UpdateStepsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: StepsInfo
  ) {

    this.hostHeaderInfo = new hostHeaderInfo();
    this.StepsData = new StepsData();
    this.StepsData.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit() {
    console.log(this.data.data);

    this.stepsFormGroup = this._formBuilder.group({
      allowedDaysInStep: [this.data.data.allowedDaysInStep],
      isPartOfADR: [this.data.data.isPartOfADR],
      isActiveFlag: [ this.data.data.isActiveFlag],
      isPartOfTTL: [this.data.data.isPartOfTTL]

    });
  }

  updateStep(){
    this.loader = true;
    this.StepsData.id = this.data.data.id;
    this.StepsData.stepID = this.data.data.stepID;
    this.StepsData.companyID = this.data.compID;
    this.StepsData.createdByUserID = this.usersService.getSession('userDetails').id;
    this.StepsData.allowedDaysInStep = this.stepsFormGroup.get('allowedDaysInStep').value;
    this.StepsData.isPartOfADR = this.stepsFormGroup.get('isPartOfADR').value;
    this.StepsData.isActiveFlag = this.stepsFormGroup.get('isActiveFlag').value;
    this.StepsData.isPartOfTTL = this.stepsFormGroup.get('isPartOfTTL').value;

    this.settingsService.updateSteps(this.StepsData).subscribe(data => {
      if (data.hostHeaderInfo.responseCode === '000') {
        this.usersService.showToast('Added successfully');
        this.dialogRef.close();
        this.onSucess.emit('000');

      }else{
        this.loader = false;
        this.usersService.showToast(data.responseMessage);
      }

    }, (err: HttpErrorResponse) => {
      this.loader = false;
      this.usersService.showToast(err.message);
    });
  }

}
