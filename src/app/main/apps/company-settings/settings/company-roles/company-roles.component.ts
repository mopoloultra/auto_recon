import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { UsersService } from 'app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { addRole } from 'app/main/models/admin/roles/add/addRole';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditCompanyRoleComponent} from '../dialogs/edit-company-role/edit-company-role.component';

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
  selector: 'app-company-roles',
  templateUrl: './company-roles.component.html',
  styleUrls: ['./company-roles.component.scss']
})
export class CompanyRolesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'role', 'status', 'dateCreated', 'createdBy', 'edit'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  addCompRoleForm: FormGroup;
  addRoleData: addRole;
  showSpinner:boolean=false;
  hostHeaderInfo: hostHeaderInfo;
  isLoading:boolean = true;
  showTable: boolean = false;
  tableMessage: any ='';
  showTableMessage: boolean = false;
  showLink: boolean = false;
  constructor( private _formBuilder: FormBuilder, public dialog: MatDialog, public usersService: UsersService)
  {

    this.addRoleData = new addRole();
    this.addRoleData.hostHeaderInfo = new hostHeaderInfo();
  }

  ngOnInit(): void
  {
    this.isLoading = true;
    this.showTable = false;
    this.showTableMessage = false;
    this.showLink = false;
    // Reactive Form
    this.addCompRoleForm = this._formBuilder.group({
      company   : ['', Validators.required]
    });

    this.getCompRoles();

  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCompanyRole(form: NgForm){
    this.showSpinner = true;
    //this.addRoleData.hostHeaderInfo.token = this.usersService.getSession('userToken');
    this.addRoleData.role = form.value.company;
    this.addRoleData.id = this.usersService.getSession('userDetails').id;

    console.log('company roleData=>', this.addRoleData);

    this.usersService.addCompanyRole(this.addRoleData).subscribe((data: any ) => {
      console.log(data);

      if (data.responseCode ===  '000' ) {
        this.showSpinner = false;
        this.usersService.showToast(data.responseMessage);
        this.getCompRoles();
        form.reset();

      } else {
        this.showSpinner = false;
        this.usersService.showToast(data.responseMessage);
      }
    }, (err: HttpErrorResponse) => {
      console.log('get companies role Error', err);
      this.usersService.showToast(err.message);

      this.showSpinner = false;
    });
  }


  getCompRoles(){
    const getCompData = {

      hostHeaderInfo : {
        channel : this.addRoleData.hostHeaderInfo.channel,
        sourceCode : this.addRoleData.hostHeaderInfo.sourceCode,
        token : this.usersService.getSession('userToken')
      },
      id:this.usersService.getSession('userDetails').id,
      // id: 8,
      searchType: 0
    };

    console.log(getCompData);
    this.usersService.getRoles(getCompData).subscribe((data: any) => {
      console.log(data);
      if (data){
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
        //this.usersService.showToast('Get Company List Error');
      }

    }, (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.showTable = false;
      this.showTableMessage = true;
      this.showLink = true;
      this.tableMessage = '' ;
      console.log('get all users error', err);
      //this.usersService.showToast(err.message);

    });
  }

  editRole(role){
    //this.editFormData = userData;
    console.log(role);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "35%";
    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = {
      roleData: role
    };

    this.dialog.open( EditCompanyRoleComponent ,dialogConfig);
  }

}

