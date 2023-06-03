import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { getAllUsers } from 'app/main/models/admin/users/get/getUsers';
import { editUser } from 'app/main/models/admin/users/edit/editUser';
import { UsersService } from 'app/services/users.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewUserComponent } from './view-user/view-user.component';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserData {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: string;
  status: string;
  dateCreated: string;
}

const NAMES: string[] = [
  'Jesse Sampong', 'David Amuquandoh', 'Kyle Ali-Rifai'
];

const EMAIL: string[] = [
  'Jesse.Sampong@gmail.com', 'David.Amuquandoh@gmail.com', 'Kyle.Ali.Rifai@gmail.com'
];

const CONTACT: string[] = [
  '+1 (918) 313-8806', '(+1 918) 313-8808', '+1 (918) 313-8809'
];

const ROLES: string[] = [
  'Admin', 'Help Desk', 'Body Shop', 'Contact Center', 'Trainer'
];

const STATUS: string[] = [
  'Active', 'In-Active'
];

const DATE_CREATED: string[] = [
  '02 Jul 2020 12:09:43 pm', '19 May 2020 12:09:43 am', '12 Aug 2020 12:09:43 pm', 
  '23 Feb 2020 12:09:43 am', '16 Jan 2020 12:09:43 pm', '05 Sep 2020 12:09:43 am'
];

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
  
})
export class AllUsersComponent implements OnInit,AfterViewInit {

  displayedColumns: string[] = ['name', 'email', 'contact', 'status', 'dateCreated', 'id', ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

    getFormData: getAllUsers;
    editFormData: editUser;
    hostHeaderInfo: hostHeaderInfo;

    isLoading: boolean = true;
    showTable: boolean = false;
    tableMessage: any ='';
    showTableMessage: boolean = false;
    showLink: boolean = false;
    constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog)
    {
      this.getFormData = new getAllUsers();
      this.editFormData = new editUser();

      this.hostHeaderInfo = new hostHeaderInfo();
      this.getFormData.hostHeaderInfo = new hostHeaderInfo();
      this.editFormData.hostHeaderInfo = new hostHeaderInfo();

      //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
     // this.dataSource = new MatTableDataSource(users);
      
    }

    ngOnInit(): void
    {
     this.isLoading = true;
     this.showTable = false;
     this.showTableMessage = false;
     this.showLink = false;
     this.getAllUsers();
    
    }

    ngAfterViewInit(): void {
      //this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string): any {
      console.log(filterValue);
      return this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  
     /*  if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }  */
    }


    getAllUsers(): any{
      this.getFormData.id = this.userService.getSession('userDetails').id; //this gives error
     // this.getFormData.id = 2;
     // this.getFormData.compId = this.userService.getSession('companyInfo').id;
      this.getFormData.searchType = 0;
     // this.getFormData.type = 1; // is this suppose to he hard coded?
      this.getFormData.hostHeaderInfo.token = this.userService.getSession('userToken');

      console.log(this.getFormData);
      this.userService.getAllCompanyUsers(this.getFormData).subscribe((data: any)=>{
          console.log('data data');
          console.log(data);
          if (data === null ){
            this.isLoading = false;
            this.showTable = false;
            this.showTableMessage = true;
            this.tableMessage = 'No Entries Added to Table.';
            this.showLink = false;
          }else{
            this.showTable = true;
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(data);           
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            
          }
        }, (err: HttpErrorResponse)=>{
          console.log('get all users error', err);
          this.isLoading = false;
          this.showTable = false;
          this.showTableMessage = true;
          this.showLink = true;
          this.tableMessage = '' ;
          //this.userService.showToast(err.message);
        }); 
     }

    viewInfo(userData: any): void{
    //  this.editFormData = userData;
      console.log(this.editFormData);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "35%";
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.data = {
        userData: userData
      };

      

      this.dialog.open( ViewUserComponent ,dialogConfig);
    }
}

