import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {VehicleService} from '../../../../../services/vehicle.service';
import {UsersService} from '../../../../../services/users.service';
import {InspectionNotes} from '../../../../models/vehicles/InspectionNotes';

export interface updateData{
  id: any;
  vehicleID: any;

}


@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss']
})
export class NotesDialogComponent implements OnInit {

  public InspectionNotes: InspectionNotes;
  public hostHeaderInfo: hostHeaderInfo;
  loader = false;
  notes: Array<any>;
  isData = false;

  constructor(public dialogRef: MatDialogRef<NotesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: updateData, public usersService: UsersService, public vehicleService: VehicleService) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.InspectionNotes = new InspectionNotes();
    this.InspectionNotes.hostHeaderInfo = this.hostHeaderInfo;
    this.notes = [];
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getData();
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

  getData(): void{
    this.loader = true;
    this.InspectionNotes.noteTypeID = 3;
    this.InspectionNotes.vehicleID = this.data.vehicleID;
    this.InspectionNotes.inspectionMultipointQuestionID = this.data.id;
    this.InspectionNotes.companyID = this.usersService.getSession('companyInfo').id;

    this.vehicleService.getNote(this.InspectionNotes).subscribe(resp => {

      if(resp.hostHeaderInfo.responseCode === '000'){
        this.loader = false;
        this.isData = true;
        this.notes = resp.notes;
      }else{
        this.loader = false;
        this.isData = false;
      }

    },error => {
      this.loader = false;
      this.isData = false;
    });
  }


}
