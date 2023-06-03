import { Component, OnInit, ViewChild } from '@angular/core';
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
import { EditUserComponent } from './edit-user/edit-user.component';

export interface UserData {

  role: string;
  status: string;
  dateCreated: string;
  createdBy: string;
  id: string;
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['profile.fname', 'profile.status', 'invitation.dateCreated', 'createdBy', 'id'];
  dataSource: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  roles: any ;
  showSpinner:boolean = false;
  inviteUserForm: FormGroup;
  formData: inviteUser;
  getFormData: getAllUsers;
  editFormData: editUser;
  hostHeaderInfo: hostHeaderInfo;
  getRolesData: getRoles;
  isLoading: boolean = true;
  showTable: boolean = false;
  tableMessage: any ='';
  showTableMessage: boolean = false;
  showLink: boolean = false;
    constructor(private _formBuilder: FormBuilder, public userService: UsersService, public dialog: MatDialog )
    {
      this.formData = new inviteUser();
      this.getFormData = new getAllUsers();
      this.editFormData = new editUser();
      this.getRolesData = new getRoles();
      this.hostHeaderInfo = new hostHeaderInfo();
      this.formData.hostHeaderInfo = new hostHeaderInfo();
      this.getFormData.hostHeaderInfo = new hostHeaderInfo();
      this.editFormData.hostHeaderInfo = new hostHeaderInfo();
      this.getRolesData.hostHeaderInfo = new hostHeaderInfo();
      
     
    }

    ngOnInit(): void
    {
     /*  this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; */
      this.isLoading = true;
      this.showTable = false;
      this.showTableMessage = false;
      this.showLink = false;
      
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

  ngAfterViewInit(){
    this.getUsers();
  }

    applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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
      this.formData.companyId = this.userService.getSession('companyInfo').id;
     // this.formData.companyId = '2';
      this.formData.hostHeaderInfo.token = this.userService.getSession('userToken');
      console.log('formData=>', this.formData);
      
      this.userService.inviteUser(this.formData).subscribe((data: any ) => {
        console.log(data);
        
        if (data.responseCode ===  '000' ) {
          this.showSpinner = false;
          this.userService.showToast(data.responseMessage);
          this.getUsers();
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

     getUsers(): void{
    // this gives error
      this.getFormData.id = this.userService.getSession('userDetails').id;      
     // this.getFormData.id = 2;
      this.getFormData.searchType = 0;
    //  this.getFormData.type = 1; // is this suppose to he hard coded?
      this.getFormData.hostHeaderInfo.token = this.userService.getSession('userToken');

      console.log(JSON.stringify(this.getFormData));
      this.userService.getAllCompanyUsers(this.getFormData).subscribe((data: any)=>{
          console.log(data);
          if (data) {
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

          }else{
            this.isLoading = false;
            this.showTable = false;
            this.showTableMessage = true;
            this.tableMessage = 'No Entries Added to Table.';
            this.showLink = false;
            //this.usersService.showToast('Get Company List Error');
          }             
          
        }, (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.showTable = false;
          this.showTableMessage = true;
          this.showLink = true;
          this.tableMessage = '' ;
          console.log('get all user error', err);
          //this.userService.showToast(err.message);
        });
    } 


    viewInfo(userData: any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "35%";
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.data = {
      userData: userData
      };    
  
      this.dialog.open( EditUserComponent , dialogConfig);
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
