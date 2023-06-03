import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TodoserviceService} from '../../../../services/todoservice.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-vehicle-recent-activity',
  templateUrl: './vehicle-recent-activity.component.html',
  styleUrls: ['./vehicle-recent-activity.component.scss']
})
export class VehicleRecentActivityComponent implements OnInit {

  @Input() vehicleID: any;

  displayedColumns: string[] = ['description', 'createDate'];
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

    this.todoserviceService.getVehivleActivities(this.vehicleID).subscribe(data => {
      if (data.AuditHistory.length > 0) {
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
