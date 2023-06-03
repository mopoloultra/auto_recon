import {Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../../../../../services/users.service';
import {SettingsService} from '../../settings.service';
import {MatMenuTrigger, MatPaginator, MatSelectChange} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {GetAnnouncment} from '../../../../models/settings/GetAnnouncment';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';
import {ProcessingDialogComponent} from '../../../vehicles/dialogs/processing-dialog/processing-dialog.component';
import {MatDialog} from '@angular/material';
import {AddAnnouncement} from '../../../../models/settings/AddAnnouncement';
@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  providers: [DatePipe],
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;


  public GetAnnouncment: GetAnnouncment;
  public hostHeaderInfo: hostHeaderInfo;
  public AddAnnouncement: AddAnnouncement;



  startDate = new FormControl('', Validators.required);
  endDate = new FormControl('', Validators.required);

  todayDate: any;
  twoWeeksDate: any;

  displayedColumns: string[] = ['announcement', 'startDate', 'endDate', 'createdByUserName', 'remove'];
  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('menuTrigger', {static: true}) trigger: MatMenuTrigger;

  loading = false;
  noUsersData = false;
  users: Array<any>;
  companyID: any;
  addQuoteFormGroup: FormGroup;

  constructor(public formBuilder: FormBuilder, public usersService: UsersService, private settingsService: SettingsService,  private datePipe: DatePipe, public dialog: MatDialog) {
    this._unsubscribeCompanies = new Subject();
    this.companies = [];

    this.GetAnnouncment = new GetAnnouncment();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetAnnouncment.hostHeaderInfo = this.hostHeaderInfo;

    this.AddAnnouncement = new AddAnnouncement();
    this.AddAnnouncement.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit() {

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });

    this.addQuoteFormGroup = this.formBuilder.group({
      stateDate: ['', Validators.required],
      endDate: ['', Validators.required],
      annoucement: ['', Validators.required]
    });


    this.companyID = this.usersService.getSession('companyInfo').id;
    this.todayDate = this.datePipe.transform(new Date(), 'y-M-d');
    this.twoWeeksDate = this.datePipe.transform(new Date(+ new Date - 12096e5), 'y-M-d');

    this.getData(this.todayDate, this.twoWeeksDate);
  }


  changeData(event: MatSelectChange): any{
    this.companyID = event.value;
    this.getData(this.todayDate, this.twoWeeksDate);
  }

  getData(startDate: any, endDate: any): void{

    this.GetAnnouncment.companyID = this.companyID;
    this.GetAnnouncment.isAll = true;
    this.GetAnnouncment.id = 0;
    this.GetAnnouncment.stateDate = startDate;
    this.GetAnnouncment.endDate = endDate;
    this.GetAnnouncment.isQuoteOfTheDay = false;
    this.GetAnnouncment.createdByUserID = 0;


    this.loading = true;

    this.settingsService.getAnnouncement(this.GetAnnouncment).subscribe(data => {
      if (data) {
        this.loading = false;
        this.users = data.Announcements;
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

  remove(data){

    let info;
    info = data;
    info.hostHeaderInfo = this.hostHeaderInfo;
    info.isActiveFlag = false;

    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });

    this.settingsService.addAnnouncement(info).subscribe(resp => {
      console.log(resp);
      dialogRef.close();
      if (resp.hostHeaderInfo.responseCode === '000'){
        this.usersService.showToast('Deleted successfully');
        this.getData(this.todayDate, this.twoWeeksDate);

      }else{
        this.usersService.showToast(resp.hostHeaderInfo.responseMessage);
      }
    });

  }

  saveQuote(){

    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      disableClose: true
    });

    this.AddAnnouncement.companyID = this.companyID;
    this.AddAnnouncement.createdByUserID = this.usersService.getSession('userDetails').id;
    this.AddAnnouncement.endDate = this.datePipe.transform(this.addQuoteFormGroup.get('endDate').value, 'y-M-d');
    this.AddAnnouncement.stateDate = this.datePipe.transform(this.addQuoteFormGroup.get('stateDate').value, 'y-M-d');
    this.AddAnnouncement.isQuoteOfTheDay = false;
    this.AddAnnouncement.id = 0;
    this.AddAnnouncement.isActiveFlag = true;
    this.AddAnnouncement.annoucement = this.addQuoteFormGroup.get('annoucement').value;

    this.settingsService.addAnnouncement(this.AddAnnouncement).subscribe(resp => {
      console.log(resp);
      dialogRef.close();
      if (resp.hostHeaderInfo.responseCode === '000'){
        this.trigger.closeMenu();
        this.usersService.showToast('Added successfully');
        this.addQuoteFormGroup.reset();
        this.getData(this.todayDate, this.twoWeeksDate);

      }else{
        this.usersService.showToast(resp.hostHeaderInfo.responseMessage);
      }
    });

  }
}

