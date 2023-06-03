import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { inviteUser } from 'app/main/models/admin/users/invite/inviteUser';
import { getUsers, getAllUsers } from 'app/main/models/admin/users/get/getUsers';
import { editUser } from 'app/main/models/admin/users/edit/editUser';
import { UsersService } from 'app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getRoles } from 'app/main/models/admin/roles/get/getRoles';
import { MatDialog, MatDialogConfig } from '@angular/material';

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
  isLoading :boolean= true;


  editRole: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, public dialofRef: MatDialogRef<EditUserComponent>, private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog) {
    this.userData = data.userData;


   
  }

  

  ngOnInit() {


    this.editRole = this._formBuilder.group({
      firstName : [],
      lastName  : [],
      email     : [],
      contact   : [],
      address      : [],
      address2 : [],
      city: [],
      zip: []
    });
  }

  close(){
    this.dialofRef.close();
  }

  editDetails(form: NgForm){

  }

}
