import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhasesPipe} from '../pipes/phases.pipe';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PhaseConfirmationDialogComponent} from '../dialogs/phase-confirmation-dialog/phase-confirmation-dialog.component';
import {VehicleService} from '../../../../services/vehicle.service';
import {UsersService} from '../../../../services/users.service';
import {UpdateVehiclePhase} from '../../../models/vehicles/UpdateVehiclePhase';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';

@Component({
  selector: 'app-vehicle-stepper',
  templateUrl: './vehicle-stepper.component.html',
  providers: [PhasesPipe],
  styleUrls: ['./vehicle-stepper.component.scss']
})
export class VehicleStepperComponent implements OnInit {
  phaseID: any;
  @Input() phases: Array<any>;
  phaseDialogRef: any;
  stepName: any;
  @Input() vehicleID: any;
  public UpdateVehiclePhase: UpdateVehiclePhase;
  public hostHeaderInfo: hostHeaderInfo;
  @Output() onUpdate = new EventEmitter();

  constructor(public phasesPipe: PhasesPipe, public dialog: MatDialog, public vehicleService: VehicleService, public usersService: UsersService) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.UpdateVehiclePhase =  new UpdateVehiclePhase();
    this.UpdateVehiclePhase.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {


    const currentPhase = this.phases.filter(phase => phase['isCurrent'] === true);
    this.phaseID = currentPhase[0].stepID;
    this.stepName = currentPhase[0].stepName;

    console.log(this.phaseID);


  }




  updatePhaseFromSteps(phaseName: any, phaseID: any, index: any): void {
    if(phaseID !== this.phaseID){
      this.phaseDialogRef = this.dialog.open(PhaseConfirmationDialogComponent, {
        data: {
          newPhase: phaseName,
          oldPhase: this.stepName
        }
      });

      this.phaseDialogRef.componentInstance.onUpdate.subscribe(info => {
        if (info) {
          // tslint:disable-next-line:radix
          this.updatePhaseVehicle(phaseID, this.vehicleID, phaseName, index);
        }

      });

    }





  }

  updatePhaseVehicle(phaseID: any, vehicleID: any, phaseName: any, index: any): void {
    this.UpdateVehiclePhase.userID = this.usersService.getSession('userDetails').id;
    this.UpdateVehiclePhase.vehicleID = vehicleID;
    this.UpdateVehiclePhase.stepID = phaseID;

    this.vehicleService.updateVehiclePhase(this.UpdateVehiclePhase).subscribe(response => {
      if (response.hostHeaderInfo.responseCode === '000') {
        this.phaseID = phaseID;
        this.stepName = phaseName;
        this.onUpdate.emit(phaseID);
        this.phases[index].isCurrent = true;
        this.phaseDialogRef.close();


        this.vehicleService.showToast('Vehicle phase updated sucessfully');

      } else {
        this.phaseDialogRef.componentInstance.loader = false;
        this.vehicleService.showToast(response.hostHeaderInfo.responseMessage);
      }

      // tslint:disable-next-line:no-shadowed-variable
    }, error => {
      this.phaseDialogRef.componentInstance.loader = false;
      this.vehicleService.showToast('Please try again later');
    });

  }

}
