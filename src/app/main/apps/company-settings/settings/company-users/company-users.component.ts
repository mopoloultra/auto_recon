import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { getRoles } from 'app/main/models/admin/roles/get/getRoles';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { UsersService } from 'app/services/users.service';
import { inviteUser } from 'app/main/models/admin/users/invite/inviteUser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CompanyUserViewComponent} from '../dialogs/company-user-view/company-user-view.component';

export interface UserData {
  // id: string;
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
  'Jesse Sampong', 'David Amuquandoh', 'Kyle Ali-Rifai'
];

const DATE_CREATED: string[] = [
  '02 Jul 2020 12:09:43 pm', '19 May 2020 12:09:43 am', '12 Aug 2020 12:09:43 pm',
  '23 Feb 2020 12:09:43 am', '16 Jan 2020 12:09:43 pm', '05 Sep 2020 12:09:43 am'
];

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss']
})
export class CompanyUsersComponent implements OnInit {
  displayedColumns = ['profile.fname', 'profile.status', 'invitation.dateCreated', 'createdBy'];
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  companyInviteform: FormGroup;
  hostHeaderInfo: hostHeaderInfo;
  getRolesData: getRoles;
  isLoading = false;
  showTable = false;
  tableMessage: any = '';
  showTableMessage = false;
  showLink = false;
  roles: any ;
  showSpinner = false;
  formData: inviteUser;

  userInfo: any;




  sortedData: any;

  constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog )
  {
    this.getRolesData = new getRoles();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getRolesData.hostHeaderInfo = new hostHeaderInfo();

    this.formData = new inviteUser();
    this.formData.hostHeaderInfo = new hostHeaderInfo();

  }

  ngOnInit(): void
  {
    this.isLoading = true;
    this.showTable = false;
    this.showTableMessage = false;
    this.showLink = false;
    // Reactive Form
    this.companyInviteform = this._formBuilder.group({
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      otherName : [],
      email   : ['', Validators.required],
      contact  : ['', Validators.required],
      role      : ['', Validators.required]
    });

    this.getRoles();

  }

  ngAfterViewInit(){
    this.getAllCompanyUsers();

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  getAllCompanyUsers(): void{
    const compUsersData = {
      hostHeaderInfo: {
        channel: 'web',
        sourceCode: 'xxx',
        token: this.userService.getSession('userToken')
      },
      id: this.userService.getSession('userDetails').id ,
      // id:2,
      compId: this.userService.getSession('companyInfo').id ,
      searchtype: 0,
      type: 1,
    };

    console.log('get all users=>', compUsersData);

    this.userService.getAllCompanyUsers(compUsersData).subscribe((data: any) => {
      console.log('company users data=>', data);
      this.userInfo = data;
      if (data !== null){
        this.showTable = true;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'profile.fname': return item.profile.fname;
            case 'invitation.dateCreated': return item.invitation.dateCreated;
            case 'profile.status': return item.profile.status;
            default: return item[property];
          }
        };
        this.dataSource.sort = this.sort;

        this.dataSource.paginator = this.paginator;
        this.sortedData = this.userInfo.slice();
      }else{
        this.isLoading = false;
        this.showTable = false;
        this.showTableMessage = true;
        this.tableMessage = 'No Entries Added to Table.';
        this.showLink = false;
      }
    }, (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.showTable = false;
      this.showTableMessage = true;
      this.showLink = true;
      this.tableMessage = '' ;
      console.log('get company error', err);
      // this.userService.showToast(err.message);

    });
  }

  sendInvite(form: NgForm): any{
    this.showSpinner = true;
    console.log(this.formData);
    this.formData.fname = form.value.firstName;
    this.formData.lname = form.value.lastName;
    this.formData.oname = form.value.otherName;
    this.formData.contact = form.value.contact;
    this.formData.role = form.value.role;
    this.formData.email = form.value.email;
    this.formData.id = this.userService.getSession('userDetails').id;
    this.formData.companyId = this.userService.getSession('companyInfo').id;
    // this.formData.companyId = '2';
    this.formData.hostHeaderInfo.token = this.userService.getSession('userToken');
    console.log('formData=>', this.formData);

    this.userService.inviteUser(this.formData).subscribe((data: any ) => {
      console.log(data);

      if (data.responseCode ===  '000' ) {
        this.showSpinner = false;
        this.userService.showToast(data.responseMessage);
        this.getAllCompanyUsers();
        form.reset();

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
    this.getRolesData.hostHeaderInfo.token = this.userService.getSession('userToken');
    console.log('this.getRolesData');
    console.log(this.getRolesData);

    this.userService.getRoles(this.getRolesData).subscribe((data: any) => {
      console.log('roles data=>', data);
      this.roles = data;
      console.log('this.roles');
      console.log(this.roles);


    });
  }

  // tslint:disable-next-line:typedef
  viewInfo(userData: any){
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

    this.dialog.open( CompanyUserViewComponent , dialogConfig);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // sortData(sort: Sort) {
  //     const data = this.desserts.slice();
  //     if (!sort.active || sort.direction === '') {
  //         this.sortedData = data;
  //         return;
  //     }
  //
  //     this.sortedData = data.sort((a, b) => {
  //         const isAsc = sort.direction === 'asc';
  //         switch (sort.active) {
  //             case 'fname': return this.compare(a.name, b.name, isAsc);
  //             case 'calories': this.return compare(a.calories, b.calories, isAsc);
  //             case 'fat': return this.compare(a.fat, b.fat, isAsc);
  //             default: return 0;
  //         }
  //     });
  // }




}


