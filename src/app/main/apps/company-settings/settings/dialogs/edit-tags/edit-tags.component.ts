import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {UsersService} from '../../../../../../services/users.service';
import {TodoserviceService} from '../../../../../../services/todoservice.service';
import {hostHeaderInfo} from '../../../../../models/hostHeaderInfo';
import {HttpErrorResponse} from '@angular/common/http';
import {AddTags} from '../../../../../models/tags/addTags';

export interface EditTagData {
  data: any;
  compID: any;
}

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {
  addTagFormGroup: FormGroup;
  public hostHeaderInfo: hostHeaderInfo;
  public AddTags: AddTags;
  loader = false;
  @Output() onSucess = new EventEmitter();

  colorSerials = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700'
  ];
  // tslint:disable-next-line:max-line-length
  colors =  ['red-', 'pink-', 'purple-', 'deep-purple-', 'indigo-', 'blue-', 'light-blue-', 'cyan-', 'teal-', 'green-', 'light-green-', 'lime-', 'yellow-', 'amber-', 'orange-', 'deep-orange-', 'brown-', 'grey-', 'blue-grey-'];

  selectedColor: any;

  constructor(
      private _formBuilder: FormBuilder,
      private todoServiceService: TodoserviceService,
      public usersService: UsersService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<EditTagsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: EditTagData
  ) {


    this.hostHeaderInfo = new hostHeaderInfo();
    this.AddTags = new AddTags();
    this.AddTags.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit(): void {
    console.log(this.data);

    this.selectedColor = this.data.data.colorCode;

    this.addTagFormGroup = this._formBuilder.group({
      name: [this.data.data.name, Validators.required],
      description: [this.data.data.description],
      isActiveFlag: [ this.data.data.isActiveFlag],
      isTask: [this.data.data.isTask],
      isVehicle: [this.data.data.isVehicle]

    });
  }


  addTag(): void {
    this.loader = true;
    this.AddTags.id = this.data.data.id;
    this.AddTags.companyID = this.data.compID;
    this.AddTags.createdByUserID = this.usersService.getSession('userDetails').id;
    this.AddTags.name = this.addTagFormGroup.get('name').value;
    this.AddTags.description = this.addTagFormGroup.get('description').value;
    this.AddTags.isTask = this.addTagFormGroup.get('isTask').value;
    this.AddTags.isVehicle = this.addTagFormGroup.get('isVehicle').value;
    this.AddTags.isActiveFlag =  this.addTagFormGroup.get('isActiveFlag').value;
    console.log(JSON.stringify(this.AddTags));



    this.todoServiceService.addTag(this.AddTags).subscribe(data => {
      if (data.responseCode === '000') {
        this.showToast('Added successfully');
        this.dialogRef.close();
        this.onSucess.emit('000');

      }else{
        this.loader = false;
        this.showToast(data.responseMessage);
      }

    }, (err: HttpErrorResponse) => {
      this.loader = false;
      this.showToast(err.message);
    });

    console.log(this.AddTags);
  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  getSelectColor(color: any): void{
    this.selectedColor = color;
    this.AddTags.colorCode = color;
    console.log(color);
  }

  colorClases(color:any) {

    if (color ===  this.selectedColor){
      const className =   color + ' color-pallete-tile-seleted';
      const colorObj = {};
      colorObj[className] = true;
      return colorObj;
    }else{
      const classNameAlt = color + ' color-pallete-tile';
      const colorObj = {};
      colorObj[classNameAlt] = true;
      return colorObj;
    }


  }




}
