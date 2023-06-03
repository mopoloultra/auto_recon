import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from '../../../../services/users.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {GetNotesByType} from '../../../models/vehicles/getNotesByType';


@Component({
  selector: 'app-vehicle-notes',
  templateUrl: './vehicle-notes.component.html',
  styleUrls: ['./vehicle-notes.component.scss']
})
export class VehicleNotesComponent implements OnInit {

  @Input() vehicleID: any;
  public hostHeaderInfo: hostHeaderInfo;
  public GetNotesByType: GetNotesByType;
  resp: any;
  noteTypes: Array<any>;
  body: any;
  response: any;
  notes: Array<any>;
  loader = false;
  isData = false;


  constructor(public vehicleService: VehicleService, public usersService: UsersService) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetNotesByType = new GetNotesByType();
    this.GetNotesByType.hostHeaderInfo = this.hostHeaderInfo;

    if (!this.body){
      this.body = {
        hostHeaderInfo : {
          channel : 'web',
          sourceCode : 'xxx',
          token : 'xxxxx'
        }

      };
    }

    this.noteTypes = [];
    this.notes = [];
  }

  ngOnInit(): void {

    this.getTypes();
  }


  getTypes(): void{

    this.vehicleService.getNotesByType(this.body).subscribe( res => {
      this.resp = res;
      if(this.resp.hostHeaderInfo.responseCode === '000'){
        this.noteTypes = this.resp.noteTypes;
      }else{
        this.noteTypes = [];
      }
    },error => {
      this.noteTypes = [];
    });
  }
  getData(id): void{
    this.loader = true;
    this.isData = false;
    this.notes = [];
    this.GetNotesByType.noteTypeID = id;
    this.GetNotesByType.vehicleID = this.vehicleID;
    this.GetNotesByType.inspectionMultipointQuestionID = 0;
    this.GetNotesByType.companyID = this.usersService.getSession('companyInfo').id;


    this.vehicleService.getNote(this.GetNotesByType).subscribe(resp => {
      console.log(resp);

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
