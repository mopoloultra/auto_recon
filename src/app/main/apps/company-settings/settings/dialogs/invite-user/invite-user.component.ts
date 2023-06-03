import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {inviteUser} from '../../../../../models/admin/users/invite/inviteUser';
import {UsersService} from '../../../../../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {getRoles} from '../../../../../models/admin/roles/get/getRoles';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';

export interface EditTagData {
  compID: any;
}

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {

  roles: any ;
  showSpinner: boolean = false;
  inviteUserForm: FormGroup;
  formData: inviteUser;
  @Output() onSucess = new EventEmitter();
  getRolesData: getRoles;
  public hostHeaderInfo: hostHeaderInfo;

  constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialofRef: MatDialogRef<InviteUserComponent>,@Inject(MAT_DIALOG_DATA) public data: EditTagData) {
    this.getRolesData = new getRoles();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getRolesData.hostHeaderInfo = this.hostHeaderInfo;
    this.formData = new inviteUser();
    this.formData.hostHeaderInfo = this.hostHeaderInfo;


  }

  ngOnInit() {

    this.inviteUserForm = this._formBuilder.group({
      firstName : [this.formData.fname, Validators.required],
      lastName  : [this.formData.lname, Validators.required],
      otherName : [this.formData.oname],
      email     : [this.formData.email, Validators.required],
      contact   : [this.formData.contact, Validators.required],
      role      : [this.formData.role, Validators.required]
    });

    this.getRoles();
  }

  sendInvite(form: NgForm): any{
    this.showSpinner = true;
    console.log(this.formData);
    this.formData.id = this.userService.getSession('userDetails').id;
    this.formData.fname = form.value.firstName;
    this.formData.lname = form.value.lastName;
    this.formData.oname = form.value.otherName;
    this.formData.email = form.value.email;
    this.formData.contact = form.value.contact;
    this.formData.role = form.value.role;
    this.formData.companyId = this.data.compID;
    // this.formData.companyId = '2';
    this.formData.hostHeaderInfo.token = this.userService.getSession('userToken');
    console.log('formData=>', this.formData);

    this.userService.inviteUser(this.formData).subscribe((data: any ) => {
      console.log(data);

      if (data.responseCode ===  '000' ) {
        this.showSpinner = false;
        this.userService.showToast(data.responseMessage);
        this.onSucess.emit('000');
        this.dialofRef.close();


      } else {
        this.showSpinner = false;
        this.userService.showToast(data.responseMessage);
      }
    }, (err: HttpErrorResponse) => {
      console.log('invite user Error', err);
      this.showSpinner = false;
    });
  }

  getRoles(): void{
    this.getRolesData.id = this.userService.getSession('userDetails').id;
    this.getRolesData.hostHeaderInfo.token = '';
    console.log('this.getRolesData');
    console.log(this.getRolesData);

    this.userService.getRoles(this.getRolesData).subscribe((data: any) => {
      console.log('roles data=>', data);
      this.roles = data;
      console.log('this.roles');
      console.log(this.roles);


    });
  }


}
