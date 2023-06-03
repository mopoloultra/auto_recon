import { Component, OnInit, ViewChild  } from '@angular/core';
import {AddTagComponent} from '../dialogs/add-tag/add-tag.component';
import {MatDialogConfig, MatDialog, MatPaginator, MatSelectChange} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {AddTags} from '../../../../models/tags/addTags';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {UsersService} from '../../../../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EditTagsComponent} from '../dialogs/edit-tags/edit-tags.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SettingsService} from '../../settings.service';

export interface TagsInterface {
  id: number;
  isVehicle: boolean;
  isTask: boolean;
  name: string;
  description: string;
  createDate: string;
  createdByUserName: string;
  isActiveFlag: boolean;


}




@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'isActiveFlag', 'name', 'description', 'color', 'isTask', 'isVehicle', 'createdByUserName', 'createDate', 'edit'];
  public tagsData: AddTags;
  public hostHeaderInfo: hostHeaderInfo;

  dataSource: any;
  loading = false;
  noTagsData = false;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  tags: TagsInterface[];

  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;
  compID: any;



  constructor(
      public dialog: MatDialog,
      private todoserviceService: TodoserviceService,
      public usersService: UsersService,
      public settingsService: SettingsService
  ) {
    this.tagsData = new AddTags();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.tagsData.hostHeaderInfo = this.hostHeaderInfo;

    this._unsubscribeCompanies = new Subject();
    this.companies = [];
  }

  ngOnInit(): void {

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });


    this.compID = this.usersService.getSession('companyInfo').id;
    this.getTags();
  }

  addNewTag(): void{
    const dialogRef = this.dialog.open(AddTagComponent, {
      width: '650px',
      height: '500px',
      data: {compID: this.compID}
    });

    dialogRef.componentInstance.onSucess.subscribe(data => {
      if (data === '000'){
        this.getTags();
      }
    });
  }

  getTags(): void{
    this.loading = true;
    this.tagsData.companyID = this.compID;
    this.tagsData.isTask =  1;
    this.tagsData.isActiveFlag = true;
    this.tagsData.isVehicle = 1;

    this.todoserviceService.getTags(this.tagsData).subscribe((data) => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.tags = data;
        this.dataSource = new MatTableDataSource(this.tags);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }else{
        this.loading = false;
        this.noTagsData = true;
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.noTagsData = true;

    });

  }

  updateTags(data: any): void{
    if(this.getPermissions()){
      const dialogRef = this.dialog.open(EditTagsComponent, {
        width: '650px',
        height: '500px',
        data: {data: data, compID: this.compID}
      });
      dialogRef.componentInstance.onSucess.subscribe(data => {
        if (data === '000'){
          this.getTags();
        }
      });
    }




  }

  changeData(event: MatSelectChange): any{
    this.compID = event.value;
    this.getTags();
  }


  getPermissions(): boolean {

    let status = false;
    const permissions = this.usersService.getSession('permissions');
    const count = permissions.length;
    for (let i = 0; i < count; i++) {
      status = !!((permissions[i].id === this.compID) && permissions[i].IsAllowedToCreateEditTag);
      return status;
    }


  }
}
