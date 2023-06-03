import {Component, OnInit, ViewChild} from '@angular/core';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  displayedColumns: string[] = ['description'];
  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;

  constructor(public todoserviceService: TodoserviceService) { }

  ngOnInit() {

    this.getData();
  }

  getData(): void{

    this.loading = true;

    this.todoserviceService.getActivities().subscribe(data => {
      if (data) {
        this.loading = false;
        this.users = data.AuditHistory;
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



}
