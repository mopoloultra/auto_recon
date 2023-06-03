import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { inviteUser } from 'app/main/models/admin/users/invite/inviteUser';
import {  getAllUsers } from 'app/main/models/admin/users/get/getUsers';
import {editUser, editUserProfile} from 'app/main/models/admin/users/edit/editUser';
import { UsersService } from 'app/services/users.service';
import { getRoles } from 'app/main/models/admin/roles/get/getRoles';
import { MatDialog } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userData: any;

  roles: any ;
  showSpinner:boolean = false;
  inviteUserForm: FormGroup;
  formData: inviteUser;
  getFormData: getAllUsers;
  editFormData: editUser;
  hostHeaderInfo: hostHeaderInfo;
  getRolesData: getRoles;
  isLoading = false;
  data: editUserProfile;
  @Output() onSucess = new EventEmitter();

  editRole: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, public dialofRef: MatDialogRef<EditUserComponent>, private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog, public sanitizer: DomSanitizer) {
    this.userData = data.userData;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.data = new editUserProfile();
    this.data.hostHeaderInfo = this.hostHeaderInfo;



  }



  ngOnInit() {


    this.editRole = this._formBuilder.group({
      firstName : [this.userData.profile.fname],
      lastName  : [this.userData.profile.sname],
      email     : [this.userData.profile.email],
      contact   : [this.userData.profile.contact],
      address      : [this.userData.profile.address],
      address2 : [ this.userData.profile.address2],
      city: [this.userData.profile.city],
      zip: [this.userData.profile.zip]
    });
  }

  close(){
    this.dialofRef.close();
  }

  updateDetails(){
    this.isLoading = true;
    this.data.id = this.userData.profile.id;
    this.data.fname = this.editRole.get('firstName').value;
    this.data.sname = this.editRole.get('lastName').value;
    this.data.oname = '';
    this.data.contact = this.editRole.get('contact').value;
    this.data.email = this.editRole.get('email').value;
    this.data.address = this.editRole.get('address').value;
    this.data.address2 = this.editRole.get('address2').value;
    this.data.city = this.editRole.get('city').value;
    this.data.state  = this.editRole.get('city').value;
    this.data.zip = this.editRole.get('zip').value;

    this.userService.editProfileInfo(this.data).subscribe(resp => {
      this.isLoading = false;
      if(resp.responseCode === '000'){
        this.userService.showToast('User data updated successfully');
        this.dialofRef.close();
        this.onSucess.emit('000');
      }else{
        this.userService.showToast(resp.responseMessage);
      }
    },error => {
      this.userService.showToast('Please try again later');
    })

  }

  imageConvert(img): any {

      return  this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + img);

  }

}

