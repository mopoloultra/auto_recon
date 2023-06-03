import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {getAllUsers} from '../../../../models/admin/users/get/getUsers';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {UsersService} from '../../../../../services/users.service';
import {Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialogConfig, MatPaginator, MatSelectChange} from '@angular/material';
import {MatDialog} from '@angular/material';
import {EditUserComponent} from '../dialogs/edit-user/edit-user.component';
import {InviteUserComponent} from '../dialogs/invite-user/invite-user.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SettingsService} from '../../settings.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public hostHeaderInfo: hostHeaderInfo;
  public getAllUsers: getAllUsers;

  displayedColumns: string[] = ['profile.status', 'profile.fname', 'profile.sname', 'profile.contact', 'profile.email', 'invitation.dateCompleted', 'profile.id'];
  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;
  companyID: any;


  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;




  constructor(public usersService: UsersService, public dialog: MatDialog, public settingsService: SettingsService) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getAllUsers = new getAllUsers();
    this.getAllUsers.hostHeaderInfo = this.hostHeaderInfo;


    this._unsubscribeCompanies = new Subject();
    this.companies = [];
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    this.users = [];

    this.getCompanyUsers(this.usersService.getSession('companyInfo').id);
    this.companyID = this.usersService.getSession('companyInfo').id;

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });


  }

  getCompanyUsers(companyID): void{
    this.getAllUsers.compId = companyID;
    this.getAllUsers.type = 0;
    this.getAllUsers.searchType = 0;
    this.getAllUsers.id = this.usersService.getSession('userDetails').id;

    this.loading = true;

    this.usersService.getCompanyUsers(this.getAllUsers).subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.users = data.info;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }else{

        this.noUsersData = true;
      }
    }, (err: HttpErrorResponse) => {
      this.noUsersData = true;

    });
  }



  viewInfo(userData: any): void{
    if(this.getPermissions()){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      // dialogConfig.width = "35%";
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.data = {
        userData: userData
      };

      const dialogRef =  this.dialog.open( EditUserComponent , dialogConfig);
      dialogRef.componentInstance.onSucess.subscribe( res =>{
        if (res){
          this.getCompanyUsers(this.companyID);
        }
      });
    }

  }

  addNewUser(): void{
    const dialogRef = this.dialog.open(InviteUserComponent, {
      width: '65vh',
      data: {compID: this.companyID}
    });

    dialogRef.componentInstance.onSucess.subscribe( res => {
      if (res) {
        this.getCompanyUsers(this.companyID);
      }
    });


  }

  changeData(event: MatSelectChange): any{
    this.getCompanyUsers(event.value);
  }

  getPermissions(): boolean{
    let status = false;
    const permissions = this.usersService.getSession('permissions');
    const count = permissions.length;
    for (let i = 0; i < count; i++){
      status = !!((permissions[i].id === this.companyID) && permissions[i].IsAllowedToCreateEditUser);
      return status;
    }



  }



}
