import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {Router} from '@angular/router';
import {PluginServiceGlobalRegistrationAndOptions} from 'ng2-charts';
import {MatDialog, MatDialogRef, MatSelectChange, MatTabChangeEvent} from '@angular/material';
import {hostHeaderInfo} from '../../models/hostHeaderInfo';
import {GetVehicle} from '../../models/vehicles/GetVehicle';
import {UsersService} from '../../../services/users.service';
import {VehicleService} from '../../../services/vehicle.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PhaseConfirmationDialogComponent} from './dialogs/phase-confirmation-dialog/phase-confirmation-dialog.component';
import {UpdateVehiclePhase} from '../../models/vehicles/UpdateVehiclePhase';
import {error} from 'util';
import {FormControl, Validators} from '@angular/forms';
import {ProcessingDialogComponent} from './dialogs/processing-dialog/processing-dialog.component';

import {InspectionNotes} from '../../models/vehicles/InspectionNotes';
import {TodoserviceService} from '../../../services/todoservice.service';
import {ActivitiesDialogComponent} from './dialogs/activities-dialog/activities-dialog.component';
import {VehicleTag} from '../../models/vehicles/VehicleTag';
import {VehicleFav} from '../../models/vehicles/VehicleFav';
import {PdfService} from '../../../services/pdf.service';
import {MatIconRegistry} from '@angular/material/icon';


declare var innerRadius: any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  animations: fuseAnimations
})
export class VehiclesComponent implements OnInit {

  selected = 'option2';
  stage = 'Incoming';
  timeInPhase = 'Coming';
  deviationInPhase = '7 Days';
  timeInAllPhases = '30 Days';
  phaseId: number;

  public InspectionNotes: InspectionNotes;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  obs: Observable<any>;

  dataSource: MatTableDataSource<any>;

  phases = [];
  // Private
  private _unsubscribeAll: Subject<any>;

  public hostHeaderInfo: hostHeaderInfo;
  public GetVehicle: GetVehicle;
  public VehicleFav: VehicleFav;

  vehicles: [];
  resp: any;
  filter: string;



  loading = false;
  noData = false;

  phaseDialogRef: MatDialogRef<any>;
  public UpdateVehiclePhase: UpdateVehiclePhase;
  tabIndex = 0;
  vehicleTags: Array<any>;

  public VehicleTag: VehicleTag;

  public doughnutChartLabels =  [
    'Days Active',
    'Days Left'
  ];



  public doughnutChartType = 'doughnut';
  public options = {
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
    cutoutPercentage: 70,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    animation: false
  };

  private dashboardState: Subject<any>;
  stepsStats: any;

  defaultView = true;

  optionsView: any;

  notes = new FormControl('', Validators.required);
  loadingNotes = false;


  favDialog: any;
  tagDelDialog: any;
  tagAddDialog: any;
  noteDialog: any;
  phasesDialog: any;
  faveOption: any;
  hotlistOption: any;




  constructor(public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef, private router: Router, public usersService: UsersService, public vehicleService: VehicleService, private sanitizer: DomSanitizer,public todoserviceService: TodoserviceService , iconRegistry: MatIconRegistry) {

    iconRegistry.addSvgIcon(
        'condensed',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/condensed.svg'));

    iconRegistry.addSvgIcon(
        'detailed',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/detailed.svg'));

    iconRegistry.addSvgIcon(
        'fire',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/fire.svg'));

    iconRegistry.addSvgIcon(
        'view',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/view.svg'));

    iconRegistry.addSvgIcon(
        'user',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/user.svg'));

    iconRegistry.addSvgIcon(
        'archive',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/archive.svg'));

    iconRegistry.addSvgIcon(
        'star',
        sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/car-view/star.svg'));



    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetVehicle = new GetVehicle();
    this.GetVehicle.hostHeaderInfo = this.hostHeaderInfo;
    this.UpdateVehiclePhase = new UpdateVehiclePhase();
    this.UpdateVehiclePhase.hostHeaderInfo = this.hostHeaderInfo;
    this.VehicleTag = new VehicleTag();
    this.VehicleTag.hostHeaderInfo = this.hostHeaderInfo;
    this.VehicleFav = new VehicleFav();
    this.VehicleFav.hostHeaderInfo = this.hostHeaderInfo;


    this.vehicles = [];
    this.phases = [];
    this.phaseId = 1;
    this.vehicleTags = [];


    this._unsubscribeAll = new Subject();
    this.dashboardState = new Subject();

    this.InspectionNotes = new InspectionNotes();
    this.InspectionNotes.hostHeaderInfo = this.hostHeaderInfo;
    this.faveOption = '';
    this.hotlistOption = '';
  }

  ngOnInit(): void {
    this.getVehicleTags();
    this.getData(0);


    this.vehicleService.onPhasesChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(phases => {
          this.phases = phases.steps;

        });

    this.vehicleService.onStatsChange
        .pipe(takeUntil(this.dashboardState))
        .subscribe(resp => {
          this.stepsStats = resp.stepsStats[0];


        });

  }

  view(vehicleID): void  {
    let route = '/apps/vehicle-view/' + vehicleID;
    console.log(vehicleID);
    this.router.navigate([route]);
  }

  getData(id: number): void{
    this.vehicles = [];
    this.loading = true;
    this.noData = true;
    this.GetVehicle.phaseID = id + 1;
    this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
    this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
    this.GetVehicle.vehicleID = 0;

    this.vehicleService.getCompanyVehicles(this.GetVehicle).subscribe(res => {
      this.resp = res;

      if (this.resp.hostHeaderInfo.responseCode === '000'){
          this.vehicles = this.resp.vehicles;
          if (this.vehicles.length > 0){
            this.loading = false;

            if (this.faveOption === 'faves'){
              const vehiclesArray = this.vehicles.filter(type => type['isFav'] === true);
              if (vehiclesArray.length > 0) {
                this.noData = false;
                this.dataSource = new MatTableDataSource<any>(vehiclesArray);
                this.changeDetectorRef.detectChanges();
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
              }else{
                this.noData = true;
              }
            }


            else{
              this.noData = false;
              this.dataSource = new MatTableDataSource<any>(this.vehicles);
              this.changeDetectorRef.detectChanges();
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
            }



          }else{
            this.loading = false;
            this.noData = true;
          }

      }else {
        this.loading = false;
        this.noData = true;
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.noData = true;

    });
    // console.log(this.GetVehicle);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.phaseId = tabChangeEvent.index;
    this.phaseId = this.phaseId + 1;
    this.tabIndex = tabChangeEvent.index;
    this.getData(tabChangeEvent.index);
  }



  imageConvert(vehicleImg): any {
    if (vehicleImg != null) {
      return  this.sanitizer.bypassSecurityTrustUrl('data:Image/*;base64,' + vehicleImg);
    }else {
      return '/assets/sample-car-imgs/placeholder.png';
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  confirmUpdatePhase(currentPhaseName: any, vehicleID: any, event: MatSelectChange): void{
    this.phaseDialogRef = this.dialog.open(PhaseConfirmationDialogComponent, {
      data: {newPhase: this.getNewPhaseName(event.value), oldPhase: currentPhaseName}
    });

    this.phaseDialogRef.componentInstance.onUpdate.subscribe(info => {
      if (info){
        // tslint:disable-next-line:radix
        this.updatePhase(parseInt(event.value), vehicleID, this.tabIndex);
      }

    });

  }

  getNewPhaseName(phaseId: any): any{
    const count = this.phases.length;
    for (let i = 0; i < count; i++){
      // tslint:disable-next-line:triple-equals
      if (this.phases[i].id == phaseId){
        return this.phases[i].name;

      }
    }

  }

  updatePhase(phaseID: any, vehicleID: any, index: any): void{
    this.UpdateVehiclePhase.userID = this.usersService.getSession('userDetails').id;
    this.UpdateVehiclePhase.vehicleID = vehicleID;
    this.UpdateVehiclePhase.stepID = phaseID;

    this.vehicleService.updateVehiclePhase(this.UpdateVehiclePhase).subscribe( response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.getDataNoLoad(this.phaseId - 1 , 'phases');
        this.phases[index].vehiclesCount = this.phases[index].vehiclesCount - 1;
        const newPhaseIndex = phaseID - 1 ;
        this.phases[newPhaseIndex].vehiclesCount = this.phases[newPhaseIndex].vehiclesCount + 1;

      } else {
        this.phaseDialogRef.componentInstance.loader = false;
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

      // tslint:disable-next-line:no-shadowed-variable
    },error => {
      this.phaseDialogRef.componentInstance.loader = false;
      this.vehicleService.showToast('Please try again later');
    });

  }

  getAverageDataSets(data: any): any{


    if (data){
      let daysLeft = 0;
      let info = 0;
      if(data < 31){
        info = data;
        daysLeft = data - 30;
      }else{
        info = 30;
        daysLeft = 0;
      }
      return [
        {
          data: [ info, daysLeft],
          backgroundColor: [
            '#6cbf54',
            '#cccccc'
          ],
          hoverBackgroundColor: [
            '#6cbf54',
            '#cccccc'
          ],
          weight: 3
        },
      ];
  }else{
      return [
        {
          data: [ 0, 0],
          backgroundColor: [
            '#6cbf54',
            '#cccccc'
          ],
          hoverBackgroundColor: [
            '#6cbf54',
            '#cccccc'
          ],
          weight: 3
        },
      ];
    }

  }

  getAverageAllDataSets(data: any): any{
    if (data){
      let daysLeft = 0;
      let info = 0;
      if(data < 31){
        info = data;
        daysLeft = data - 30;
      }else{
        info = 30;
        daysLeft = 0;
      }
      return [
        {
          data: [ info, daysLeft],
          backgroundColor: [
            '#f4496b',
            '#cccccc'
          ],
          hoverBackgroundColor: [
            '#f4496b',
            '#cccccc'
          ],
          weight: 3
        },
      ];
    }else{
      return [
        {
          data: [ 0, 0],
          backgroundColor: [
            '#f4496b',
            '#cccccc'
          ],
          hoverBackgroundColor: [
            '#f4496b',
            '#cccccc'
          ],
          weight: 3
        },
      ];
    }

  }

  getAverageOptions(data: any): PluginServiceGlobalRegistrationAndOptions[]{

    return [{
      beforeDraw(chart) {
        const ctx = chart.ctx;
        const txt = 'Center Text';

        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (74 * 2)

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = 70;


        const stringWidth = ctx.measureText(txt).width;
        const elementWidth = (74 * 2) - sidePaddingCalculated;

        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = (74 * 2);


        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        ctx.font =   '20px Arial';
        ctx.fillStyle = '#cccccc';

        // Draw text in center
        ctx.fillText(data, centerX, centerY);
      }
    }];


  }

  getAverageAllOptions(data: any): PluginServiceGlobalRegistrationAndOptions[] {
    return [{
      beforeDraw(chart) {
        const ctx = chart.ctx;
        const txt = 'Center Text';

        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (74 * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = 70;


        const stringWidth = ctx.measureText(txt).width;
        const elementWidth = (74 * 2) - sidePaddingCalculated;

        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = (74 * 2);


        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        ctx.font =   '20px Arial';
        ctx.fillStyle = '#cccccc';

        // Draw text in center
        ctx.fillText(data, centerX, centerY);
      }
    }];
  }

  getFaves(){
    if(this.faveOption !== 'faves'){
      this.faveOption = 'faves';

      const vehiclesArray = this.vehicles.filter(type => type['isFav'] === true);
      if (vehiclesArray.length > 0) {
        this.noData = false;
        this.dataSource = new MatTableDataSource<any>(vehiclesArray);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }else{
        this.noData = true;
      }
    }
    else {
      this.faveOption = '';
      if (this.vehicles.length > 0) {
        this.noData = false;
        this.dataSource = new MatTableDataSource<any>(this.vehicles);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }else{
        this.noData = true;
      }
    }
  }
  viewAllSteps(): void{
    if(this.optionsView !== 'all'){
      this.optionsView = 'all';
      this.defaultView = false;
      this.getData(-1);
    }else{
      this.getData(0);
      this.optionsView = '';
      this.defaultView = true;
    }

  }

  viewHotList(): void{
    if(this.hotlistOption !== 'hotlist'){
      this.hotlistOption = 'hotlist';

      const vehiclesArray = this.vehicles.filter(type => type['isHotListVehicle'] === true);
      if (vehiclesArray.length > 0) {
        this.noData = false;
        this.dataSource = new MatTableDataSource<any>(vehiclesArray);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }else{
        this.noData = true;
      }
    }
    else {
      this.hotlistOption = '';
      if (this.vehicles.length > 0) {
        this.noData = false;
        this.dataSource = new MatTableDataSource<any>(this.vehicles);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }else{
        this.noData = true;
      }
    }


  }



  getVehicleTags(): void{
    this.vehicleService.getVehicleTags().subscribe(resp =>{
      if (resp.hostHeaderInfo.responseCode === '000'){
        this.vehicleTags = resp.tags;
        console.log(this.vehicleTags);

      }
    });
  }

  getNotesToSelf(id): void{
    this.loadingNotes = true;
    this.vehicleService.getVehicleNotes(id).subscribe( resp => {
      if(resp.hostHeaderInfo.responseCode === '000'){
        this.notes.setValue(resp.notes[0].note);
        this.InspectionNotes.id = resp.notes[0].id;
      }else{
        this.notes.setValue('');
        this.InspectionNotes.id = 0;
      }
      this.loadingNotes = false;
    });
  }

  saveNote(id): void {
    this.noteDialog = this.dialog.open(ProcessingDialogComponent, {
      width: '100px',
      height: '100px',
      disableClose: false
    });

    this.InspectionNotes.inspectionMultipointQuestionID = 0;
    this.InspectionNotes.note = this.notes.value;
    this.InspectionNotes.isActiveFlag = true;
    this.InspectionNotes.vehicleID = id;
    this.InspectionNotes.createdByUserID = this.usersService.getSession('userDetails').id;
    this.InspectionNotes.companyID = this.usersService.getSession('companyInfo').id;
    this.InspectionNotes.noteTypeID = 1;

    this.vehicleService.saveNote(this.InspectionNotes).subscribe(response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.vehicleService.showToast('Note added successfully');
        this.noteDialog .close();
        this.notes.setValue('');
      } else {
        this.noteDialog .close();
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.noteDialog .close();
      this.vehicleService.showToast('Please try again later');
    });

  }




  viewActivities(vehicleID): void{
    this.dialog.open(ActivitiesDialogComponent, {
      width: '60vw',
      data: {vehicleID: vehicleID}

    });
  }

  addTag(tag: any, vehicleID: any, phaseID: any): void{
    this.tagAddDialog = this.dialog.open(ProcessingDialogComponent, {
      width: '100px',
      height: '100px',
      disableClose: false
    });


    this.VehicleTag.tagID = tag.id;
    this.VehicleTag.vehicleID = vehicleID;
    this.VehicleTag.isActiveFlag  = true;
    this.VehicleTag.createdByUserID = this.usersService.getSession('userDetails').id;

    this.vehicleService.vehicleTag(this.VehicleTag).subscribe(response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        if(phaseID === 0){
          this.getDataNoLoad(-1, 'addTag');
        }else{
          this.getDataNoLoad(phaseID - 1, 'addTag');
        }
      } else {
        this.tagAddDialog.close();
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.tagAddDialog.close();
      this.vehicleService.showToast('Please try again later');
    });
  }

  deleteTag(tag: any, vehicleID: any, phaseID: any): void{
    this.tagDelDialog = this.dialog.open(ProcessingDialogComponent, {
      width: '100px',
      height: '100px',
      disableClose: false
    });


    this.VehicleTag.tagID = tag.id;
    this.VehicleTag.vehicleID = vehicleID;
    this.VehicleTag.isActiveFlag  = false;
    this.VehicleTag.createdByUserID = this.usersService.getSession('userDetails').id;

    this.vehicleService.vehicleTag(this.VehicleTag).subscribe(response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        if(phaseID === 0){
          this.getDataNoLoad(-1, 'deleteTag');
        }else{
          this.getDataNoLoad(phaseID - 1, 'deleteTag');
        }

      } else {
        this.tagDelDialog.close();
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.tagDelDialog.close();
      this.vehicleService.showToast('Please try again later');
    });


  }

  vehicleFav(vehicleID: any, isFav: boolean, phaseID: number): void{


    this.favDialog = this.dialog.open(ProcessingDialogComponent, {
      width: '100px',
      height: '100px',
      disableClose: false
    });


    this.VehicleFav.vehicleID = vehicleID;
    this.VehicleFav.companyID = this.usersService.getSession('companyInfo').id;
    this.VehicleFav.createdByUserID = this.usersService.getSession('userDetails').id;
    this.VehicleFav.isFav = !isFav;

    this.vehicleService.vehicleFav(this.VehicleFav).subscribe(response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        if(phaseID === 0){
          this.getDataNoLoad(-1, 'fave');
        }else{
          this.getDataNoLoad(phaseID - 1, 'fave');
        }
      } else {
        this.favDialog.close();
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.favDialog.close();
      this.vehicleService.showToast('Please try again later');
    });


  }



  getDataNoLoad(id: number, activity: string): void{
    this.GetVehicle.phaseID = id + 1;
    this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
    this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
    this.GetVehicle.vehicleID = 0;

    this.vehicleService.getCompanyVehicles(this.GetVehicle).subscribe(res => {
      this.resp = res;

      if (this.resp.hostHeaderInfo.responseCode === '000') {
        this.vehicles = this.resp.vehicles;
        if (this.vehicles.length > 0) {
          if (this.faveOption === 'faves'){
            const vehiclesArray = this.vehicles.filter(type => type['isFav'] === true);
            if (vehiclesArray.length > 0) {
              this.noData = false;
              this.dataSource = new MatTableDataSource<any>(vehiclesArray);
              this.changeDetectorRef.detectChanges();
              this.dataSource.paginator = this.paginator;
              this.obs = this.dataSource.connect();
            }else{
              this.noData = true;
            }
          }else{
            this.dataSource = new MatTableDataSource<any>(this.vehicles);
            this.changeDetectorRef.detectChanges();
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();
          }


          if (activity === 'fave'){
            this.vehicleService.showToast('Success');
            this.favDialog.close();
          }else if (activity === 'deleteTag'){
            this.vehicleService.showToast('Tag removed successfully');
            this.tagDelDialog.close();
          }else if (activity === 'addTag'){
            this.vehicleService.showToast('Tag added successfully');
            this.tagAddDialog.close();
          }else if (activity === 'phases'){
            this.phaseDialogRef.close();
            this.vehicleService.showToast('Vehicle phase updated sucessfully');
          }
        }
        else{
          this.noData = true;
        }
      }
    });
    // console.log(this.GetVehicle);
  }




}
