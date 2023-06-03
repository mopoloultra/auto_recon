import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { UsersService } from 'app/services/users.service';
import {DomSanitizer} from '@angular/platform-browser';
declare var $: any;
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ProfilePic} from '../../models/user/ProfilePic';
import {hostHeaderInfo} from '../../models/hostHeaderInfo';
import {ProcessingDialogComponent} from '../vehicles/dialogs/processing-dialog/processing-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated 
})
export class ProfileComponent implements OnInit {

  userDetails:any={};
  userCompanyInfo:any={};
  userInfo:any;
  userCompanies:any;
  profileImg: any;
  userInfoFormGroup: FormGroup;
  addressInfoFormGroup: FormGroup;

  public hostHeaderInfo: hostHeaderInfo;
  public ProfilePic: ProfilePic;
  updatingPic = false;

  viewonly = true;
  constructor(public formBuilder: FormBuilder,public dialog: MatDialog, public userService: UsersService, public sanitizer: DomSanitizer) {
      this.userCompanies = [];
      this.hostHeaderInfo = new hostHeaderInfo();
      this.ProfilePic = new ProfilePic();
      this.ProfilePic.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit() {
    $('.dropify').dropify({
      tpl: {
        message:
            '<div class="dropify-message">' +
            '<p style="font-size: 15px; text-align: center;">CHANGE</p>' +
            '</div>',

      }
    });
    this.userDetails = this.userService.getSession('userDetails');
    this.userCompanies = this.userService.getSession('userCompanies');
    this.userInfo = this.userService.getSession('userDetails');

    this.userInfoFormGroup = this.formBuilder.group({
      fname: [this.userDetails.fname , Validators.required],
      sname: [this.userDetails.sname , Validators.required],
      email: [this.userDetails.email , Validators.required],
      contact: [this.userDetails.contact , Validators.required]
    });

    this.addressInfoFormGroup = this.formBuilder.group({
      address: [this.userDetails.address , Validators.required],
      address2: [this.userDetails.address2 ],
      city: [this.userDetails.city , Validators.required],
      state: [this.userDetails.state , Validators.required],
      zip: [this.userDetails.zip , Validators.required]
    });
    this.userInfoFormGroup.disable();
    this.addressInfoFormGroup.disable();

    this.profileImg = this.imageConvert(this.userDetails.profilePic);
    console.log(this.userCompanies);
   // this.userDetails = this.userService.getSession('userDetails');
  }

  toggleEdit(){
    if(this.userInfoFormGroup.disabled){
      this.userInfoFormGroup.enable();
    }else {
      this.userInfoFormGroup.disable();
    }

  }

  toggleAddress(){
    if(this.addressInfoFormGroup.disabled){
      this.addressInfoFormGroup.enable();
    }else {
      this.addressInfoFormGroup.disable();
    }
  }

  imageConvert(logo): any {
    if (logo.length > 4) {
      return  this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + logo);
    }else {
      return '../../../../../assets/images/avatars/profile.jpg';
    }
  }

  logoConvert(logo): any {
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
      this.userService.showToast('invalid format');
      return;
    }
    else if (file.size > 1000000){
      this.userService.showToast('File size 1MB exceeded');
      $('.dropify-clear').click();
      return;
    }

    else{
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }

  }

  _handleReaderLoaded(e): any {
    const reader = e.target;
    this.ProfilePic.profilePic = reader.result.substr(reader.result.indexOf(',') + 1);
    this.ProfilePic.id = this.userService.getSession('userDetails').id;
    this.updatingPic = true;


    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });

    this.userService.editPic(this.ProfilePic).subscribe(resp => {
      this.updatingPic = false;
      if(resp.responseCode === '000'){
        $('.dropify-clear').click();
        dialogRef.close();
        this.userService.showToast('Profile Picture successfully');
        this.profileImg = this.imageConvert(this.ProfilePic.profilePic);
        this.userDetails.profilePic = this.ProfilePic.profilePic;
        sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));



      }else{
        dialogRef.close();
        this.userService.showToast(resp.reponseMessage);
      }

    },error => {
      dialogRef.close();
      this.userService.showToast('Please try again later');
    });



  }

  savePersonalChanges(){

    this.userDetails.fname  = this.userInfoFormGroup.get('fname').value;
    this.userDetails.sname  = this.userInfoFormGroup.get('sname').value;
    this.userDetails.email   = this.userInfoFormGroup.get('email').value;
    this.userDetails.contact  = this.userInfoFormGroup.get('contact').value;

    this.userInfo.fname  = this.userInfoFormGroup.get('fname').value;
    this.userInfo.sname  = this.userInfoFormGroup.get('sname').value;
    this.userInfo.email   = this.userInfoFormGroup.get('email').value;
    this.userInfo.contact  = this.userInfoFormGroup.get('contact').value;



    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });




    const info = this.userDetails;
    info.hostHeaderInfo = this.hostHeaderInfo;
    delete info['isSuper'];
    delete info['profilePic'];
    delete info['roles'];
    delete info['status'];
    delete info['statusName'];

    const data = this.userInfo;



    this.userService.editProfileInfo(info).subscribe(resp => {
      this.updatingPic = false;
      if(resp.responseCode === '000'){
        dialogRef.close();
        this.userService.showToast('Updated successfully');
        sessionStorage.setItem('userDetails', JSON.stringify(data));
        this.userInfoFormGroup.disable();

      }else{
        dialogRef.close();
        this.userService.showToast(resp.reponseMessage);
      }

    },error => {
      dialogRef.close();
      this.userService.showToast('Please try again later');
    });







  }


  saveAddress(){

    this.userDetails.address  = this.addressInfoFormGroup.get('address').value;
    this.userDetails.address2  = this.addressInfoFormGroup.get('address2').value;
    this.userDetails.city   = this.addressInfoFormGroup.get('city').value;
    this.userDetails.state  = this.addressInfoFormGroup.get('state').value;
    this.userDetails.zip  = this.addressInfoFormGroup.get('zip').value;

    this.userInfo.address  = this.addressInfoFormGroup.get('address').value;
    this.userInfo.address2  = this.addressInfoFormGroup.get('address2').value;
    this.userInfo.city   = this.addressInfoFormGroup.get('city').value;
    this.userInfo.state  = this.addressInfoFormGroup.get('state').value;
    this.userInfo.zip  = this.addressInfoFormGroup.get('zip').value;



    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });




    const info = this.userDetails;
    info.hostHeaderInfo = this.hostHeaderInfo;
    delete info['isSuper'];
    delete info['profilePic'];
    delete info['roles'];
    delete info['status'];
    delete info['statusName'];

    const data = this.userInfo;



    this.userService.editProfileInfo(info).subscribe(resp => {
      this.updatingPic = false;
      if(resp.responseCode === '000'){
        dialogRef.close();
        this.userService.showToast('Updated successfully');
        sessionStorage.setItem('userDetails', JSON.stringify(data));
        this.userInfoFormGroup.disable();

      }else{
        dialogRef.close();
        this.userService.showToast(resp.reponseMessage);
      }

    },error => {
      dialogRef.close();
      this.userService.showToast('Please try again later');
    });







  }









}
