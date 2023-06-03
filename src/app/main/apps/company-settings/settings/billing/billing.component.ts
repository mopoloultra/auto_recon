import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {UsersService} from '../../../../../services/users.service';
import {SettingsService} from '../../settings.service';
import {GetSteps} from '../../../../models/settings/GetSteps';
import {HttpErrorResponse} from '@angular/common/http';
import {MatPaginator, MatSelectChange} from '@angular/material';
import {MatDialog} from '@angular/material';
import {UpdateStepsComponent} from '../dialogs/update-steps/update-steps.component';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {StepsData} from '../../../../models/settings/StepsData';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  public GetSteps: GetSteps;
  public hostHeaderInfo: hostHeaderInfo;

  displayedColumns: string[] = ['isActiveFlag', 'stepName', 'allowedDaysInStep', 'isPartOfTTL', 'isPartOfADR', 'createdByUserName', 'createDate', 'update'];
  dataSource: any;
  loading = false;
  noTagsData = false;
  steps: Array<any>;
  @Output() onSucess = new EventEmitter();
  daysFormGroup: FormGroup;
  daysLoader = false;

  public StepsData: StepsData;

  private _unsubscribeCompanies: Subject<any>;
  companies: Array<any>;
  compID: any;


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;



  constructor(public formBuilder: FormBuilder, public usersService: UsersService, private settingsService: SettingsService, public dialog: MatDialog) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetSteps = new GetSteps();
    this.GetSteps.hostHeaderInfo = this.hostHeaderInfo;
    this.steps = [];
    this.StepsData = new StepsData();
    this.StepsData.hostHeaderInfo = this.hostHeaderInfo;

    this._unsubscribeCompanies = new Subject();
    this.companies = [];
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    this.settingsService.onCompanyData
        .pipe(takeUntil(this._unsubscribeCompanies))
        .subscribe(resp => {
          this.companies = resp.company;
        });

    this.getData();
  }

  update(data){
    if(this.getPermissions() && (data.id === 0 || data.id > 0 ) ){
      const dialogRef = this.dialog.open(UpdateStepsComponent,{
        data :{data: data ,compID: this.compID},
        width: '400px',
        height: '300px'
      });

      dialogRef.componentInstance.onSucess.subscribe(res => {
        if(res){
          this.getData();
        }
      });
    }else  if ((!this.usersService.getSession('userDetails').isSuper) &&  data.id > 0 ){
      const dialogRef = this.dialog.open(UpdateStepsComponent,{
        data : {data: data},
        width: '400px',
        height: '300px'
      });

      dialogRef.componentInstance.onSucess.subscribe(res => {
        if(res){
          this.getData();
        }
      });
    }
    else{
      this.usersService.showToast('Restricted user aceces');
    }



  }

  getData(){
    this.GetSteps.id = 0;
    this.GetSteps.companyID = this.usersService.getSession('companyInfo').id;
    this.GetSteps.stepID = 0;
    this.loading = true;

    this.settingsService.getCompanySteps(this.GetSteps).subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.daysFormGroup = this.formBuilder.group({
          ADRGoal: [data.stepAllowedPeriods[0].ADRGoal, Validators.required],
          TTLGoal: [data.stepAllowedPeriods[0].TTLGoal, Validators.required],
          completedVehicleByWeekGoal: [0, Validators.required]
        });
        this.steps = data.stepAllowedPeriods;
        this.dataSource = new MatTableDataSource(this.steps);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }else{

        this.noTagsData = true;
      }
    }, (err: HttpErrorResponse) => {
      this.noTagsData = true;

    });

  }

  updateDays(): void{
    this.daysLoader = true;
    this.StepsData.ADRGoal = this.daysFormGroup.get('ADRGoal').value;
    this.StepsData.TTLGoal = this.daysFormGroup.get('TTLGoal').value;
    this.StepsData.companyID = this.compID;
    this.StepsData.completedVehicleByWeekGoal = this.daysFormGroup.get('completedVehicleByWeekGoal').value;

    this.settingsService.updateSteps(this.StepsData).subscribe(data => {
      if (data.hostHeaderInfo.responseCode === '000') {
        this.usersService.showToast('Updated successfully');
        this.daysLoader = false;

      }else{
        this.daysLoader = false;
        this.usersService.showToast(data.responseMessage);
      }

    }, (err: HttpErrorResponse) => {
      this.daysLoader = false;
      this.usersService.showToast(err.message);
    });

  }

  changeData(event: MatSelectChange): any{

    this.GetSteps.id = 0;
    this.GetSteps.companyID = event.value;
    this.GetSteps.stepID = 0;
    this.loading = true;
    this.compID = event.value;

    this.settingsService.getCompanySteps(this.GetSteps).subscribe(data => {
      console.log(data);
      if (data) {
        this.loading = false;
        this.daysFormGroup = this.formBuilder.group({
          ADRGoal: [data.stepAllowedPeriods[0].ADRGoal, Validators.required],
          TTLGoal: [data.stepAllowedPeriods[0].TTLGoal, Validators.required],
          completedVehicleByWeekGoal: [0, Validators.required]
        });
        this.steps = data.stepAllowedPeriods;
        this.dataSource = new MatTableDataSource(this.steps);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }else{

        this.noTagsData = true;
      }
    }, (err: HttpErrorResponse) => {
      this.noTagsData = true;

    });
  }

  getPermissions(): boolean{

    let status = false;
    const permissions = this.usersService.getSession('permissions');
    const count = permissions.length;
    for (let i = 0; i < count; i++){
      status = !!((permissions[i].id === this.compID) && permissions[i].IsAllowedToChangeStep);
      return status;
    }

    }

}




