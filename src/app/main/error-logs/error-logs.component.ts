import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

export interface UserData {
  id:string
  method: string;
  exception: string;
  dateCreated: string;
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
  styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit {

  displayedColumns: string[] = ['method', 'exception', 'dateCreated', 'id' ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  form: FormGroup;

    constructor(private _formBuilder: FormBuilder)
    {
      const users = Array.from({length: 100}, (_, k) => createNewException(k + 1));

      this.dataSource = new MatTableDataSource(users);
    }

    ngOnInit(): void
    {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }


    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    
}
/** Builds and returns a new User. */
function createNewException(id: number): UserData {

  return {
    id: id.toString(),
    method: METHOD[Math.round(Math.random() * (METHOD.length - 1))],
    exception: EXCEPTION[Math.round(Math.random() * (EXCEPTION.length - 1))],
    dateCreated: DATE_CREATED[Math.round(Math.random() * (DATE_CREATED.length - 1))]
  };
}