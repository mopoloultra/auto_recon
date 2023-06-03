import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatPaginator, MatSelectChange} from '@angular/material';
import {Subject} from 'rxjs';
import {UsersService} from '../../../../../services/users.service';
import {SettingsService} from '../../settings.service';
import {getAllUsers} from '../../../../models/admin/users/get/getUsers';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {takeUntil} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';
import {VendorDialogComponent} from '../dialogs/vendor-dialog/vendor-dialog.component';



@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  public hostHeaderInfo: hostHeaderInfo;
  public getAllUsers: getAllUsers;

  displayedColumns: string[] = ['name', 'phoneNumber', 'email', 'address', 'createdByUserName', 'listOfVendorType', 'id'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;
  companyID: any;
  dataSource: any;
  vendorTypeList: Array<any>;
  vendorList: Array<any>;


  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;

  constructor(public usersService: UsersService, public dialog: MatDialog,private route: Router,  public settingsService: SettingsService) {

    this._unsubscribeCompanies = new Subject();
    this.companies = [];
    this.vendorTypeList = [];
    this.vendorList = [];
    this.companyID = usersService.getSession('companyInfo').id;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getAllUsers = new getAllUsers();
    this.getAllUsers.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {

    this.users = [];

    this.getCompanyVendors(this.usersService.getSession('companyInfo').id);

    this.getCompanyVendorType();


    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });
  }

  getCompanyVendors(compID: any): void{

    this.getAllUsers.companyID = compID;

    this.loading = true;

    this.usersService.getCompanyVendors(this.getAllUsers).subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.users = data.vendorList;
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

  changeData(event: MatSelectChange): any{
    this.getCompanyVendors(event.value);
    this.companyID = event.value;
    this.getCompanyVendorType();

  }

  getCompanyVendorType(): void{
    this.settingsService.getCompanyVendorType(this.companyID).subscribe(res => {
      if (res.hostHeaderInfo.responseCode === '000'){
        this.vendorTypeList = res.vendorTypeList;
      }
    });
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNew(): void{
    const dialogRef = this.dialog.open(VendorDialogComponent, {

      width: '650px',
      height: '500px',
      data: {
        vendorTypeList: this.vendorTypeList,
        vendorType: '',
        companyVendorID: 0,
        companyID: this.companyID,
        name: '',
        contact: '',
        email: '',
        address: '',
        isActiveFlag: true,
        createdByUserID: this.usersService.getSession('userDetails').id,
        vendorTypeIDs: [],
      }
    });

    dialogRef.componentInstance.onSucess.subscribe(data => {
      if (data === '000'){

        this.getAllUsers.companyID = this.companyID;

        this.usersService.getCompanyVendors(this.getAllUsers).subscribe(data => {
          console.log(data);
          if (data) {

            this.users = data.vendorList;
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
    });
  }

  viewInfo(info: any): void{

    const dialogRef = this.dialog.open(VendorDialogComponent, {

      width: '650px',
      height: '500px',
      data: {
        vendorTypeList: this.vendorTypeList,
        vendorType: info.listOfVendorType,
        companyVendorID: info.id,
        companyID: this.companyID,
        name: info.name,
        contact: info.phoneNumber,
        email: info.email,
        address: info.address,
        isActiveFlag: true,
        createdByUserID: this.usersService.getSession('userDetails').id,
        vendorTypeIDs: [],
      }
    });

    dialogRef.componentInstance.onSucess.subscribe(data => {
      if (data === '000'){

        this.getAllUsers.companyID = this.companyID;

        this.usersService.getCompanyVendors(this.getAllUsers).subscribe(data => {
          console.log(data);
          if (data) {

            this.users = data.vendorList;
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
    });
  }

  viewVendorUsers(vendorDetails : any) : void 
  {
    const vendorId   = btoa(vendorDetails.id);
    sessionStorage.setItem('vendorDetails', JSON.stringify(vendorDetails));
    this.route.navigate(['/apps/settings/vendor',vendorId]);
  }

}
