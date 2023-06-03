import {Component, OnInit, ViewChild} from '@angular/core';
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
import {QuestionsDialogComponent} from '../dialogs/questions-dialog/questions-dialog.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public hostHeaderInfo: hostHeaderInfo;
  public getAllUsers: getAllUsers;

  displayedColumns: string[] = ['typeName', 'name', 'isCreateSubletItemOnFail', 'position', 'createdByUserName', 'isActiveFlag'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;
  companyID: any;
  dataSource: any;
  vendorTypeList: Array<any>;
  inspectionMultipointQuestionTypes: Array<any>;


  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;

  constructor(public usersService: UsersService, public dialog: MatDialog, public settingsService: SettingsService) {

    this._unsubscribeCompanies = new Subject();
    this.companies = [];
    this.vendorTypeList = [];
    this.inspectionMultipointQuestionTypes = [];
    this.companyID = usersService.getSession('companyInfo').id;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getAllUsers = new getAllUsers();
    this.getAllUsers.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {

    this.users = [];

    this.getCompanyQuestions(this.usersService.getSession('companyInfo').id);

    this.getCompanyVendorType();
    this.getQuestionTypes();

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });

  }

  getCompanyQuestions(compID: any): void{

    this.getAllUsers.companyID = compID;

    this.loading = true;

    this.usersService.getCompanyQuestions(this.getAllUsers).subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.users = data.questionList;
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
    this.getCompanyQuestions(event.value);
    this.companyID = event.value;
    this.getCompanyVendorType();
    this.getQuestionTypes();
  }

  addNew(): void{
    const dialogRef = this.dialog.open(QuestionsDialogComponent, {

      width: '650px',
      height: '500px',
      data: {
        vendorTypeList: this.vendorTypeList,
        inspectionMultipointQuestionTypes: this.inspectionMultipointQuestionTypes,
        companyID: this.companyID,
        name: '',
        description: '',
        position: '',
        isActiveFlag: true,
        TypeID: 0,
        isCreateSubletItemOnFail: false,
        companyVendorType: 0,
        InspectionMultipointQuestionID: 0,
        createdByUserID: this.usersService.getSession('userDetails').id,
        createdByUserName: this.usersService.getSession('userDetails').id
      }
    });

    dialogRef.componentInstance.onSucess.subscribe(data => {
      if (data === '000'){

        this.getAllUsers.companyID = this.companyID;

        this.usersService.getCompanyQuestions(this.getAllUsers).subscribe(data => {
          console.log(data);
          if (data) {

            this.users = data.questionList;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewInfo(info: any): void{
    const dialogRef = this.dialog.open(QuestionsDialogComponent, {

      width: '650px',
      height: '500px',
      data: {
        vendorTypeList: this.vendorTypeList,
        inspectionMultipointQuestionTypes: this.inspectionMultipointQuestionTypes,
        companyID: this.companyID,
        name: info.name,
        description: info.description,
        position: info.position,
        isActiveFlag: true,
        TypeID: info.typeID,
        isCreateSubletItemOnFail: info.isCreateSubletItemOnFail,
        companyVendorType: info.companyVendorType,
        InspectionMultipointQuestionID: info.id
      }
    });

    dialogRef.componentInstance.onSucess.subscribe(data => {
      if (data === '000'){
        this.getAllUsers.companyID = this.companyID;

        this.usersService.getCompanyQuestions(this.getAllUsers).subscribe(data => {
          console.log(data);
          if (data) {

            this.users = data.questionList;
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

  getCompanyVendorType(): void{
    this.settingsService.getCompanyVendorType(this.companyID).subscribe(res => {
      if (res.hostHeaderInfo.responseCode === '000'){
        this.vendorTypeList = res.vendorTypeList;
      }
    });
  }

  getQuestionTypes(): void{
    this.settingsService.getQuestionTypes(this.companyID).subscribe(res => {
      if (res.hostHeaderInfo.responseCode === '000'){
        this.inspectionMultipointQuestionTypes = res.inspectionMultipointQuestionTypes;
      }
    });
  }
}
