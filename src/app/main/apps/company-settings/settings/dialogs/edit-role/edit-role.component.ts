import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA ,MatDialogRef} from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'app/services/users.service';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  roleData: any;
  editRoleForm:FormGroup;
  hostHeaderInfo: hostHeaderInfo = new hostHeaderInfo();
  showSpinner: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) data: any, public formBuilder: FormBuilder,
              public dialofRef: MatDialogRef<EditRoleComponent>, public usersService: UsersService, public router: Router) {
    this.roleData = data.roleData;

  }

  ngOnInit() {
    this.editRoleForm = this.formBuilder.group({
      role: [this.roleData.role, Validators.required]
    })
  }

  close(): any{
    return this.dialofRef.close();
  }

  editRole(form : NgForm): void{
    this.showSpinner = true;
    console.log(form.value.role);
    const editRole = {
      hostHeaderInfo :{
        channel : this.hostHeaderInfo.channel ,
        sourceCode :  this.hostHeaderInfo.sourceCode ,
        token : this.usersService.getSession('token'),
      },
      id: this.usersService.getSession('userDetails').id,
      roleId :this.roleData.id,

      roleName : form.value.role ,
      status :0
    }



    console.log('editRole');
    console.log(editRole);

    this.usersService.editRole(editRole).subscribe((data: any)=>{
      console.log(data);

      if (data.responseCode === '000') {
        this.showSpinner = false;
        this.dialofRef.close();

        this.usersService.showToast(data.responseMessage);


        //add behavior subject here
      } else {
        this.showSpinner = false;
        this.usersService.showToast(data.responseMessage);
      }
    },(err: HttpErrorResponse) =>{
      this.showSpinner = false;

      console.log('edit role error =>', err);

    });

  }
}

