import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ErrorModel} from '../../../../models/settings/ErrorModel';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {SettingsService} from '../../settings.service';
import {DatePipe} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material';

export interface UserData {
  id: any;
  method: any;
  type: any;
  exception: any;
  dateCreated: any;
}

const METHOD: string[] = [
  'getCompanyRole', 'createCompanyUser', 'resetCompanyUserPassword', 'authAdmin', 'addRole'
];

const EXCEPTION: string[] = [
  'Column \'authorized_id\' does not belong to table Table.',
  'Object cannot be cast from DBNull to other types.',
  'Conversion failed when converting the varchar value \'IWNIIAYRTQ\' to data type int.',
  'Column \'address2\' does not belong to table Table.',
  'Input string was not in a correct format.',
  'Object reference not set to an instance of an object.',
  'Column \'date_created\' does not belong to table Table1.',
  'Conversion failed when converting the nvarchar value \'d\' to data type int.',
  'Column \'status\' does not belong to table Table1.'
];

const DATE_CREATED: string[] = [
  '02 Jul 2020 12:09:43 pm', '19 May 2020 12:09:43 am', '12 Aug 2020 12:09:43 pm',
  '23 Feb 2020 12:09:43 am', '16 Jan 2020 12:09:43 pm', '05 Sep 2020 12:09:43 am'
];

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  providers: [DatePipe],
  styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit {
  displayedColumns: string[] = ['method', 'exception', 'dateCreated', 'id' ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  form: FormGroup;
  todayDate: any;
  twoWeeksDate: any;
  public ErrorModel: ErrorModel;
  public hostHeaderInfo: hostHeaderInfo;
  loader = false;
  isData = false;

  startDate = new FormControl('', Validators.required);
  endDate = new FormControl('', Validators.required);

  constructor(private _formBuilder: FormBuilder, public settingsService: SettingsService, private datePipe: DatePipe)
  {


    this.hostHeaderInfo = new hostHeaderInfo();
    this.ErrorModel = new ErrorModel();
    this.ErrorModel.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void
  {

    this.todayDate = this.datePipe.transform(new Date(), 'M/d/y');
    this.twoWeeksDate = this.datePipe.transform(new Date(+ new Date - 12096e5), 'M/d/y');
    this.getErros(this.twoWeeksDate, this.todayDate);
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getErros(startDate: any, endDate: any): void{
    this.loader = true;
    this.ErrorModel.id = 1;
    this.ErrorModel.startDate = startDate;
    this.ErrorModel.endDate = endDate;
    this.ErrorModel.Type = '';

    this.settingsService.getErrors(this.ErrorModel).subscribe(res => {
      console.log(res);
      if(res.hostHeaderInfo.responseCode === '000'){
        this.loader = false;
        if(res.exceptions){
          this.isData = true;
          this.dataSource = new MatTableDataSource(res.exceptions);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else{
          this.isData = false;
        }

      }else{
        this.isData = true;
        this.loader = false;
      }
    },error => {
      this.isData = true;
      this.loader = false;
    });
  }

  getNewRange(event): void{


    if((this.startDate.value !== '') && (this.endDate.value !== '')){
      const startDate = this.datePipe.transform(this.startDate.value, 'M/d/y');
      const endDate = this.datePipe.transform(this.endDate.value, 'M/d/y');
      this.getErros(startDate, endDate);
    }

  }

}
