import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
declare var $: any;
import {SettingsService} from '../../settings.service';
import {takeUntil} from 'rxjs/operators';
import {CompanyLogo} from '../../../../models/settings/CompanyLogo';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {EditCompany} from '../../../../models/settings/EditCompany';
import {UsersService} from '../../../../../services/users.service';
import {ProcessingDialogComponent} from '../../../vehicles/dialogs/processing-dialog/processing-dialog.component';
import {MatDialog, MatSelectChange} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  companyInfoFormGroup: FormGroup;
  private _unsubscribeCompanyInfo: Subject<any>;
  public CompanyLogo: CompanyLogo;
  public hostHeaderInfo: hostHeaderInfo;
  public EditCompany: EditCompany;
  companyInfo: any;
  logo: any;

  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;
  compID: any;

  constructor(public formBuilder: FormBuilder, private settingsService: SettingsService, public usersService: UsersService, private dialog: MatDialog, public sanitizer: DomSanitizer) {
    this._unsubscribeCompanyInfo = new Subject();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.CompanyLogo = new  CompanyLogo();
    this.EditCompany = new EditCompany();
    this.CompanyLogo.hostHeaderInfo = this.hostHeaderInfo;
    this.EditCompany.hostHeaderInfo = this.hostHeaderInfo;

    this._unsubscribeCompanies = new Subject();
    this.companies = [];

  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.compID = this.usersService.getSession('companyInfo').id;
    this.settingsService.onCompanyInfoChange
        .pipe(takeUntil(this._unsubscribeCompanyInfo))
        .subscribe(resp => {
          this.companyInfo = resp.info;
          this.logo = resp.info.profilePic;
          this.companyInfoFormGroup = this.formBuilder.group({
            id: [resp.info.id, ],
            name: [resp.info.name, ],
            contact: [resp.info.contact, ],
            email: [resp.info.email, ],
            address: [resp.info.address, ],

          });



        });

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });



    $('.dropify').dropify({
      tpl: {
        message:
            '<div class="dropify-message">' +
            '<p style="font-size: 15px; text-align: center;">UPLOAD</p>' +
            '</div>',

      }
    });

  }

  checkInfoChanges(): boolean{

    delete this.companyInfo['status'];
    delete this.companyInfo['listOfAllowedApps'];
    delete this.companyInfo['profilePic'];
    delete this.companyInfo['dateAuthorized'];
    delete this.companyInfo['dateCreated'];
    let status = false;

    if(JSON.stringify(this.companyInfo) === JSON.stringify(this.companyInfoFormGroup.value)){
      status = true;
    }else{
      status = false;
    }

    return status;
  }

  imageConvert(logo): any {
    if (logo != null) {
      return  this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + logo);
    }else {
      return '/assets/img/logo_placeholder.png';
    }
  }

  getFile(event): void {

    this.handleInputChange(event.target.files[0]);

  }

  handleInputChange(files): any {
    const file = files;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.usersService.showToast('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e): any {
    const reader = e.target;
    this.CompanyLogo.profilePic = reader.result.substr(reader.result.indexOf(',') + 1);
    this.CompanyLogo.userId = this.usersService.getSession('userDetails').id;
    this.CompanyLogo.id = this.compID;

    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });

    this.settingsService.addCompanyLogo(this.CompanyLogo).subscribe(resp => {
      if(resp.hostHeaderInfo.responseCode === '000'){
        $('.dropify-clear').click();
        dialogRef.close();
        this.usersService.showToast('Logo updated successfully');
        this.logo = this.CompanyLogo.profilePic;

      }else{
        dialogRef.close();
        this.usersService.showToast(resp.hostHeaderInfo.reponseMessage);
      }

    },error => {
      dialogRef.close();
      this.usersService.showToast('Please try again later');
    });



  }

  updateInfo(): void{
    this.EditCompany.id = this.usersService.getSession('userDetails').id;
    this.EditCompany.name = this.companyInfoFormGroup.get('name').value;
    this.EditCompany.compId =  this.compID;
    this.EditCompany.contact = this.companyInfoFormGroup.get('contact').value;
    this.EditCompany.email = this.companyInfoFormGroup.get('email').value;
    this.EditCompany.address = this.companyInfoFormGroup.get('address').value;
    this.EditCompany.status = 1;
    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });
    this.settingsService.updateDateCompanyInfo(this.EditCompany).subscribe(resp => {
      if(resp.hostHeaderInfo.responseCode === '000'){

        sessionStorage.setItem('companyInfo', JSON.stringify(this.companyInfoFormGroup.value));
        dialogRef.close();
        this.usersService.showToast('Info updated updated successfully');

      }else{
        dialogRef.close();
        this.usersService.showToast(resp.hostHeaderInfo.reponseMessage);
      }

    },error => {
      dialogRef.close();
      this.usersService.showToast('Please try again later');
    });
  }

  changeData(event: MatSelectChange): any{
    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });

    this.settingsService.getCompanyInfoByID(event.value).subscribe(resp => {
      console.log(resp);
      dialogRef.close();
      if (resp.hostHeaderInfo.responseCode === '000'){
        this.compID = event.value;
        this.companyInfoFormGroup.get('name').setValue(resp.info.name);
        this.companyInfoFormGroup.get('contact').setValue(resp.info.contact);
        this.companyInfoFormGroup.get('address').setValue(resp.info.address);
        this.companyInfoFormGroup.get('email').setValue(resp.info.email);
        this.logo = resp.info.profilePic;


      }else{
        this.usersService.showToast(resp.hostHeaderInfo.responseMessage);
      }
    });

  }

  getPermissions(): boolean{
    let status = false;
    const permissions = this.usersService.getSession('permissions');
    const count = permissions.length;
    for (let i = 0; i < count; i++){
      status = !!((permissions[i].id === this.compID) && permissions[i].isAdmin);
      return status;
    }

  }



}
