import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UpdateVehiclePhase} from '../../../../models/vehicles/UpdateVehiclePhase';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {VehicleService} from '../../../../../services/vehicle.service';
import {UsersService} from '../../../../../services/users.service';
import {Router} from '@angular/router';
import {MatSelectChange} from '@angular/material';

// tslint:disable-next-line:class-name
export interface updateData{
  vehicleID: any;
  docTypes: Array<any>;
  phases: any;
}

@Component({
  selector: 'app-phase-update',
  templateUrl: './phase-update.component.html',
  styleUrls: ['./phase-update.component.scss']
})
export class PhaseUpdateComponent implements OnInit {

  public UpdateVehiclePhase: UpdateVehiclePhase;
  public hostHeaderInfo: hostHeaderInfo;
  disableSubmit = true;
  loader = false;

  constructor(public dialogRef: MatDialogRef<PhaseUpdateComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData, public usersService: UsersService, public vehicleService: VehicleService, private router: Router) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.UpdateVehiclePhase = new UpdateVehiclePhase();
    this.UpdateVehiclePhase.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  update(): void{
    this.loader = true;
    this.UpdateVehiclePhase.userID = this.usersService.getSession('userDetails').id;
    this.UpdateVehiclePhase.vehicleID = this.data.vehicleID;

    this.vehicleService.updateVehiclePhase(this.UpdateVehiclePhase).subscribe( response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.loader = false;
        this.dialogRef.close();
        this.vehicleService.showToast('Vehicle phase updated sucessfully');
        this.router.navigate(['/apps/vehicles']);


      } else {
        this.loader = false;
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

    }, error => {
      this.loader = false;
      this.vehicleService.showToast('Please try again later');
    });

  }


  onNoClick(): void{
    this.dialogRef.close();
  }

  getSelectedPhase(event: MatSelectChange): void{
    if (event.value){
        this.disableSubmit = false;
    }else{
      this.disableSubmit = true;
    }
    this.UpdateVehiclePhase.stepID = event.value;
    console.log(this.UpdateVehiclePhase.stepID);
  }

}
