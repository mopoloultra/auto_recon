import {Component, OnInit, ViewChild} from '@angular/core';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  loading = false;
  noUsersData = false;
  users: Array<any>;

  constructor(public todoserviceService: TodoserviceService, public router: Router) { }

  ngOnInit() {

    this.getData();
  }

  getData(): void{

    this.loading = true;

    this.todoserviceService.getTasks().subscribe(data => {
      if (data) {
        this.loading = false;
        this.users = data.tasks.listOfTasks;
        console.log(this.users);
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

  gotToTodo(todoID: any): void{

    this.router.navigate(['/apps/todo/task-view/' + todoID]);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
