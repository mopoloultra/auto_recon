import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Document} from '../../../../models/vehicles/Document';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {VehicleService} from '../../../../../services/vehicle.service';
import {UsersService} from '../../../../../services/users.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var $: any;


// tslint:disable-next-line:class-name
export interface updateData{
  vehicleID: any;
  docTypes: Array<any>;
}


@Component({
  selector: 'app-upload-document-dialog',
  templateUrl: './upload-document-dialog.component.html',
  styleUrls: ['./upload-document-dialog.component.scss']
})
export class UploadDocumentDialogComponent implements OnInit {

  public Document: Document;
  public hostHeaderInfo: hostHeaderInfo;
  disableSubmit = true;
  loader = false;
  documentFormGroup: FormGroup;

  @Output() onSave = new EventEmitter();



  // tslint:disable-next-line:max-line-length
  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<UploadDocumentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData, public usersService: UsersService, public vehicleService: VehicleService, private router: Router) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.Document = new Document();
    this.Document.hostHeaderInfo = this.hostHeaderInfo;
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
      isDamaged: [false],
      description: ['', Validators.required],
      documentDataByte: ['', Validators.required],
      documentTypeID: ['']
    });
  }

  save(): void{
    this.loader = true;
    this.Document.isDamaged = this.documentFormGroup.get('isDamaged').value;
    this.Document.description = this.documentFormGroup.get('description').value;
    this.Document.documentTypeID = parseInt(this.documentFormGroup.get('documentTypeID').value);
    this.Document.vehicleID = parseInt(this.data.vehicleID);
    this.Document.isActiveFlag = true;
    this.Document.createdByUserID = this.usersService.getSession('userDetails').id;
    this.Document.companyID = this.usersService.getSession('companyInfo').id;
    this.Document.id = 0;

    this.vehicleService.addNewDocument(this.Document).subscribe( response => {
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
    this.Document.name = event.target.files[0].name;
    this.Document.fileSize = event.target.files[0].size;
    this.Document.documentContentMime = event.target.files[0].type;
    this.Document.extension = event.target.files[0].type.split('image/').pop();
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
    this.Document.documentDataBase64 = reader.result.substr(reader.result.indexOf(',') + 1);

  }


}
