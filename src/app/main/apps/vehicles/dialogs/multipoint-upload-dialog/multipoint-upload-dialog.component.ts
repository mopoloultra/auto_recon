import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {VehicleService} from '../../../../../services/vehicle.service';
import {UsersService} from '../../../../../services/users.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SaveInspectionMultipointImages} from '../../../../models/vehicles/SaveInspectionMultipointImages';
import {Router} from '@angular/router';

declare var $: any;


// tslint:disable-next-line:class-name
export interface updateData{
  inspectionID: any;
  inspectionMultipointQuestionID: any;
}


@Component({
  selector: 'app-multipoint-upload-dialog',
  templateUrl: './multipoint-upload-dialog.component.html',
  styleUrls: ['./multipoint-upload-dialog.component.scss']
})
export class MultipointUploadDialogComponent implements OnInit {

  public SaveInspectionMultipointImages: SaveInspectionMultipointImages;
  public hostHeaderInfo: hostHeaderInfo;
  disableSubmit = true;
  loader = false;
  documentFormGroup: FormGroup;

  @Output() onSave = new EventEmitter();

  // tslint:disable-next-line:max-line-length
  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<MultipointUploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData, public usersService: UsersService, public vehicleService: VehicleService, private router: Router) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.SaveInspectionMultipointImages = new SaveInspectionMultipointImages();
    this.SaveInspectionMultipointImages.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {
    console.log(this.data);

    $('.dropify').dropify({
      tpl: {
        message:
            '<div class="dropify-message">' +
            '<span class="file-icon"/> ' +
            '<p style="font-size: 12px; text-align: center;">Document Image</p>' +
            '<p style="font-size: 12px; text-align: center;">Drag image here or click to add.</p>' +
            '</div>',

      }
    });

    this.documentFormGroup = this._formBuilder.group({
      description: ['', Validators.required],
      documentDataByte: [''],
      documentTypeID: ['']
    });
  }

  save(): void{
    this.loader = true;

    this.SaveInspectionMultipointImages.description = this.documentFormGroup.get('description').value;
    this.SaveInspectionMultipointImages.inspectionID = parseInt(this.data.inspectionID);
    this.SaveInspectionMultipointImages.inspectionMultipointQuestionID = parseInt(this.data.inspectionMultipointQuestionID);
    this.SaveInspectionMultipointImages.isActiveFlag = true;
    this.SaveInspectionMultipointImages.createdByUserID = this.usersService.getSession('userDetails').id;
    this.SaveInspectionMultipointImages.documentID = 0;
    this.SaveInspectionMultipointImages.documentTypeID = 11;


    this.vehicleService.saveInspectionMultipointImages(this.SaveInspectionMultipointImages).subscribe( response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.loader = false;
        this.dialogRef.close();
        this.vehicleService.showToast('Document added successfully');
        this.onSave.emit('000');

      } else {
        this.loader = false;
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.loader = false;
      this.vehicleService.showToast('Please try again later');
    });
  }


  onNoClick(): void{
    this.dialogRef.close();
  }

  getFile(event): void {

    // console.log(event.target.files[0]);
    this.SaveInspectionMultipointImages.name = event.target.files[0].name;
    this.SaveInspectionMultipointImages.fileSize = event.target.files[0].size;
    this.SaveInspectionMultipointImages.documentContentMime = event.target.files[0].type;
    this.SaveInspectionMultipointImages.extension = event.target.files[0].type.split('image/').pop();
    this.handleInputChange(event.target.files[0]);

  }

  handleInputChange(files): any {
    const file = files;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e): any {
    const reader = e.target;
    this.SaveInspectionMultipointImages.documentDataByteBaseSixFour = reader.result.substr(reader.result.indexOf(',') + 1);

  }


}
