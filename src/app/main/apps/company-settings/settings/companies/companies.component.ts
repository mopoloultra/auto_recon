import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { UsersService } from 'app/services/users.service';

import { HttpErrorResponse } from '@angular/common/http';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewCompanyComponent} from '../dialogs/view-company/view-company.component';
import {Router} from '@angular/router';
import {InviteUserComponent} from '../dialogs/invite-user/invite-user.component';
import {AddCompanyComponent} from '../dialogs/add-company/add-company.component';

export interface UserData {
  id: string;
  role: string;
  status: string;
  createdBy: string;
  dateCreated: string;
}

const ROLES: string[] = [
  'Admin', 'Help Desk', 'Body Shop', 'Contact Center', 'Trainer'
];

const STATUS: string[] = [
  'Active', 'Inactive'
];

const NAMES: string[] = [
  'JPslam Garage', 'Kyle AutoWorks', 'Code Auto Works'
];

const DATE_CREATED: string[] = [
  '02 Jul 2020 12:09:43 pm', '19 May 2020 12:09:43 am', '12 Aug 2020 12:09:43 pm',
  '23 Feb 2020 12:09:43 am', '16 Jan 2020 12:09:43 pm', '05 Sep 2020 12:09:43 am'
];


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  public hostHeaderInfo: hostHeaderInfo;
  showSpinner:boolean = false;
  displayedColumns: string[] = ['name', 'status', 'dateCreated', 'id', 'userId', 'compId'];
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  companyForm: FormGroup;
  isLoading:boolean = false;
  showTable: boolean = false;
  tableMessage: any ='';
  showTableMessage: boolean = false;
  showLink: boolean = false;
  constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog, public router: Router)
  {
    this.hostHeaderInfo = new hostHeaderInfo();

  }

  ngOnInit(): void
  {
    if(!this.userService.getSession('userDetails').isSuper ){
      this.router.navigate(['/apps/dashboard']);
      this.userService.showToast('Restricted user access');

    }
    this.isLoading = true;
    this.showTable = false;
    this.showTableMessage = false;
    this.showLink = false;
    this.getCompanies();
    // Reactive Form
    this.companyForm = this._formBuilder.group({
      name : ['', Validators.required],
      contact  : ['', Validators.required],
      email : ['', Validators.required],
      address   : ['', Validators.required]
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCompanies(): void{
    const getCompData = {
      hostHeaderInfo : {
        channel : this.hostHeaderInfo.channel,
        sourceCode : this.hostHeaderInfo.sourceCode,
        token : this.userService.getSession('userToken')
      },
      id:this.userService.getSession('userDetails').id,
      // id:8,
      searchType: 0
    };

    console.log(getCompData);
    this.userService.getCompanies(getCompData).subscribe((data: any)=>{
      console.log(data);
      if (data.hostHeaderInfo.responseCode === '000'){
        this.showTable = true;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data.company);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }else{
        this.isLoading = false;
        this.showTable = false;
        this.showTableMessage = true;
        this.tableMessage = 'No Entries Added to Table.';
        this.showLink = false;
      }

    },(err: HttpErrorResponse)=>{
      this.isLoading = false;
      this.showTable = false;
      this.showTableMessage = true;
      this.showLink = true;
      this.tableMessage = '' ;
      console.log('get all users error', err);
      // this.userService.showToast(err.message);

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

        this.getCompanies();
        form.reset();

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


  viewMoreInfo(userData: any){
    console.log(userData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "35%";
    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = {
      compData: userData
    };

    this.dialog.open( ViewCompanyComponent , dialogConfig);
  }

  addNewCompany(): void{
    const dialogRef = this.dialog.open(AddCompanyComponent, {
      width: '65vh'
    });

    dialogRef.componentInstance.onSucess.subscribe( res => {
      if (res) {
        this.getCompanies();
      }
    });

  }
}


