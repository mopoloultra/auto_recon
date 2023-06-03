import {Component, OnInit, ViewChild} from '@angular/core';
import {VehicleService} from '../../../../../services/vehicle.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hotlist',
  templateUrl: './hotlist.component.html',
  styleUrls: ['./hotlist.component.scss']
})
export class HotlistComponent implements OnInit {
  displayedColumns: string[] = ['id', 'stockNumber', 'vehicle', 'VIN', 'daysInRecon', 'dueDate', 'step', 'status'];
  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;

  constructor(public vehicleService: VehicleService, public router: Router) { }

  ngOnInit() {

    this.getData();
  }

  getData(): void{

    this.loading = true;

    this.vehicleService.getVehicleHotList().subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.users = data.hotLists;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  view(vehicleID): void  {
    const route = '/apps/vehicle-view/' + vehicleID;
    console.log(vehicleID);
    this.router.navigate([route]);
  }

}

