import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {Permissions} from '../../../../../models/settings/Permissions';
import {UsersService} from '../../../../../../services/users.service';
import {SettingsService} from '../../../settings.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';


export class Data {
  roleID: any;
  permissions: Array<any>;
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  @Output() onSucess = new EventEmitter();
  public Permissions: Permissions;
  public hostHeaderInfo: hostHeaderInfo;
  permissionsFormGroup: any;
  loader = false;

  constructor(
      private _formBuilder: FormBuilder,
      private settingsService: SettingsService,
      public usersService: UsersService,
      public dialogRef: MatDialogRef<PermissionsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    this.Permissions = new Permissions();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.Permissions.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit() {

      console.log(this.data);

    this.permissionsFormGroup = this._formBuilder.group({
        isAdmin: [this.data.permissions[0].isAdmin],
        IsAllowedToCreateEditUser: [this.data.permissions[0].IsAllowedToCreateEditUser],
        IsAllowedToCreateEditTag: [this.data.permissions[0].IsAllowedToCreateEditTag],
        IsAllowedToCreateEditRoles: [this.data.permissions[0].IsAllowedToCreateEditRoles],
        IsAllowedToViewUser: [this.data.permissions[0].IsAllowedToViewUser],
        IsAllowedToChangeStep: [this.data.permissions[0].IsAllowedToChangeStep],
        IsAllowedToAssignTasks: [this.data.permissions[0].IsAllowedToAssignTasks]
    });
  }

  save(): void{
      this.Permissions.id = this.data.roleID;
      this.Permissions.roleID = this.data.roleID;
      this.Permissions.isAdmin = this.permissionsFormGroup.get('isAdmin').value;
      this.Permissions.IsAllowedToCreateEditUser = this.permissionsFormGroup.get('IsAllowedToCreateEditUser').value;
      this.Permissions.IsAllowedToCreateEditTag = this.permissionsFormGroup.get('IsAllowedToCreateEditTag').value;
      this.Permissions.IsAllowedToCreateEditRoles = this.permissionsFormGroup.get('IsAllowedToCreateEditRoles').value;
      this.Permissions.IsAllowedToViewUser = this.permissionsFormGroup.get('IsAllowedToViewUser').value;
      this.Permissions.IsAllowedToChangeStep = this.permissionsFormGroup.get('IsAllowedToChangeStep').value;
      this.Permissions.IsAllowedToAssignTasks = this.permissionsFormGroup.get('IsAllowedToAssignTasks').value;
      this.loader = true;
      this.settingsService.userPermissions(this.Permissions).subscribe(data => {
          if (data.hostHeaderInfo.responseCode === '000') {
              this.usersService.showToast('Added successfully');
              this.dialogRef.close();
              this.onSucess.emit('000');

          }else{
              this.loader = false;
              this.usersService.showToast(data.hostHeaderInfo.responseMessage);
          }

      }, (err: HttpErrorResponse) => {
          this.loader = false;
          this.usersService.showToast(err.message);
      });

      console.log(this.Permissions);
  }

}
