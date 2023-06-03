import { Component, OnInit, ViewChild, AfterViewInit , AfterContentInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import { addRole } from '../../../../models/admin/roles/add/addRole';
import { getRoles } from '../../../../models/admin/roles/get/getRoles';
import { editRole } from '../../../../models/admin/roles/edit/editRole';
import { UsersService } from 'app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import {MatDialogConfig, MatDialog, MatSelectChange} from '@angular/material';
import { EditRoleComponent} from '../dialogs/edit-role/edit-role.component';
import {PermissionsComponent} from '../dialogs/permissions/permissions.component';
import {InviteUserComponent} from '../dialogs/invite-user/invite-user.component';
import {AddRolesComponent} from '../dialogs/add-roles/add-roles.component';
import {takeUntil} from 'rxjs/operators';
import {SettingsService} from '../../settings.service';

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
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

const DATE_CREATED: string[] = [
  '02 Jul 2020 12:09:43 pm', '19 May 2020 12:09:43 am', '12 Aug 2020 12:09:43 pm',
  '23 Feb 2020 12:09:43 am', '16 Jan 2020 12:09:43 pm', '05 Sep 2020 12:09:43 am'
];

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['role', 'status',  'dateCreated', 'id', 'permissions'];
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  adminRoleForm: FormGroup;
  formData: addRole;
  getFormData: getRoles;
  editFormData: editRole;
  hostHeaderInfo: hostHeaderInfo;
  showSpinner: boolean = false;
  isLoading: boolean = true;
  showTable: boolean = false;
  tableMessage: any ='';
  showTableMessage: boolean = false;
  showLink: boolean = false;

  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;
  compID: any;

  constructor( private _formBuilder: FormBuilder, private router: Router,
               public usersService: UsersService, public dialog: MatDialog, public settingsService: SettingsService)
  {
    this.formData = new addRole();
    this.getFormData = new getRoles();
    this.editFormData = new editRole();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.formData.hostHeaderInfo = new hostHeaderInfo();
    this.getFormData.hostHeaderInfo = new hostHeaderInfo();
    this.editFormData.hostHeaderInfo = new hostHeaderInfo();

    this._unsubscribeCompanies = new Subject();
    this.companies = [];

  }

  ngOnInit(): void
  {
    this.compID = this.usersService.getSession('companyInfo').id;
    this.isLoading = true;
    this.showTable = false;
    this.showTableMessage = false;
    this.showLink = false;
    this.getRoles();

    // Reactive Form
    this.adminRoleForm = this._formBuilder.group({
      role   : [this.formData.role, Validators.required]
    });

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });




  }

  /* ngAfterContentInit(): void {
      this.dataSource.paginator = this.paginator;

  } */

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();

    /*  if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
     } */
  }



  getRoles(){
    this.getFormData.id = 0;
    this.getFormData.hostHeaderInfo.token = this.usersService.getSession('userToken');
    this.getFormData.companyID = this.compID;
    console.log(JSON.stringify(this.getFormData));

    this.usersService.getRoles(this.getFormData).subscribe((data:any)=>{
      console.log(data);

      if (data) {
        this.showTable = true;
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }else{
        this.isLoading = false;
        this.showTable = false;
        this.showTableMessage = true;
        this.tableMessage = 'No Entries Added to Table.';
        this.showLink = false;
        // this.usersService.showToast('Get Company List Error');
      }

    }, (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.showTable = false;
      this.showTableMessage = true;
      this.showLink = true;
      this.tableMessage = '' ;
      console.log('get all roles error', err);
      // this.usersService.showToast(err.message);
    }).add(()=>{
      console.log('role loading done');

    });
  }

  editInfo(userData: any){
    if(this.getPermissions()){
      this.editFormData = userData;
      console.log(this.editFormData.id);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "35%";
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.data = {
        roleData: userData
      };

      this.dialog.open( EditRoleComponent ,dialogConfig);
    }

  }

  createRole(form: NgForm): void{
    this.showSpinner = true;
    if (form.value.company !== '') {
      this.formData.role = form.value.role;

      this.formData.id = this.usersService.getSession('userDetails').id;
      this.formData.hostHeaderInfo.token = this.usersService.getSession('userToken');
      console.log(this.formData);

      this.usersService.addCompanyRole(this.formData).subscribe((data: any) => {

        console.log('data');
        console.log(data);
        if (data.responseCode === '000') {
          this.usersService.showToast(data.responseMessage);
          this.showSpinner = false;
          this.getRoles();
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

  permissions(data, permissions): void{
    if(this.getPermissions()){
      const dialogRef = this.dialog.open(PermissionsComponent, {
        width: '40vh',
        data: {roleID: data, permissions: permissions}
      });
    }

  }

  addRoles(): void{
    const dialogRef = this.dialog.open(AddRolesComponent, { data: {compID: this.compID}});

    dialogRef.componentInstance.onSucess.subscribe( res => {
      if (res) {
        this.getRoles();
      }
    });


  }

  changeData(event: MatSelectChange): any{
    this.compID = event.value;
    this.getRoles();
  }

  getPermissions(): boolean{


    let status = false;
    const permissions = this.usersService.getSession('permissions');
    const count = permissions.length;
    for (let i = 0; i < count; i++){
      status = !!((permissions[i].id === this.compID) && permissions[i].IsAllowedToCreateEditRoles);
      return status;
    }

  }
}


