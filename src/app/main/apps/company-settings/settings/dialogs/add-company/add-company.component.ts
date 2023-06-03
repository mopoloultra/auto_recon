import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {UsersService} from '../../../../../../services/users.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  companyForm: FormGroup;
  public hostHeaderInfo: hostHeaderInfo;
  showSpinner:boolean = false;
  @Output() onSucess = new EventEmitter();

  constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog, public dialofRef: MatDialogRef<AddCompanyComponent>) {
    this.hostHeaderInfo = new hostHeaderInfo();
  }

  ngOnInit() {

    this.companyForm = this._formBuilder.group({
      name : ['', Validators.required],
      contact  : ['', Validators.required],
      email : ['', Validators.required],
      address   : ['', Validators.required]
    });

  }

  createCompany(form: NgForm): void{
    this.showSpinner = true;
    const compData = {
      hostHeaderInfo : {
        channel : this.hostHeaderInfo.channel,
        sourceCode : this.hostHeaderInfo.sourceCode,

        token : this.userService.getSession('userToken')
      },
      name:form.value.name,
      contact:form.value.contact,
      email:form.value.email,
      address:form.value.address,

      createdBy: this.userService.getSession('userDetails').id,
      // createdBy: 8,
    };

    console.log('company formData=>', compData);

    this.userService.addCompany(compData).subscribe((data: any ) => {

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
      console.log('get companies Error', err);
      this.userService.showToast(err.message);

      this.showSpinner = false;
    });
  }

}
