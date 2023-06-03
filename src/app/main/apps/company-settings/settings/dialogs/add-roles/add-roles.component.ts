import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormGroup, Validators, FormBuilder, NgForm} from '@angular/forms';
import {addRole} from '../../../../../models/admin/roles/add/addRole';
import {Router} from '@angular/router';
import {UsersService} from '../../../../../../services/users.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {HttpErrorResponse} from '@angular/common/http';

export interface EditTagData {
  compID: any;
}

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {

  adminRoleForm: FormGroup;
  formData: addRole;
  hostHeaderInfo: hostHeaderInfo;
  showSpinner: boolean = false;
  @Output() onSucess = new EventEmitter();

  constructor( private _formBuilder: FormBuilder, private router: Router,  @Inject(MAT_DIALOG_DATA) public data: EditTagData,
               public usersService: UsersService, public dialofRef: MatDialogRef<AddRolesComponent>) {
    this.formData = new addRole();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.formData.hostHeaderInfo = new hostHeaderInfo();
  }

  ngOnInit() {

    this.adminRoleForm = this._formBuilder.group({
      role   : [this.formData.role, Validators.required]
    });
  }

  createRole(form: NgForm): void{
    this.showSpinner = true;
    if (form.value.company !== '') {
      this.formData.role = form.value.role;

      this.formData.id = this.usersService.getSession('userDetails').id;
      this.formData.companyID = this.data.compID;
      this.formData.hostHeaderInfo.token = this.usersService.getSession('userToken');
      console.log(this.formData);

      this.usersService.addCompanyRole(this.formData).subscribe((data: any) => {

        console.log('data');
        console.log(data);
        if (data.responseCode === '000') {
          this.usersService.showToast(data.responseMessage);
          this.showSpinner = false;
          this.onSucess.emit('000');
          this.dialofRef.close();

        } else {
          this.usersService.showToast(data.responseMessage);
          this.showSpinner = false;
        }
      }, (err: HttpErrorResponse) => {
        console.log('add role err =>', err);
        this.showSpinner = false;
        this.usersService.showToast(err.message);

      });

    } else {
      this.showSpinner = false;
      this.usersService.showToast('Role is Required');
    }

  }

}
