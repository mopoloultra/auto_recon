import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {UsersService} from '../../../../../services/users.service';
import {getAllUsers} from '../../../../models/admin/users/get/getUsers';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {AddTags} from '../../../../models/tags/addTags';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {NewTask} from '../../../../models/tasks/NewTask';
import {DatePipe} from '@angular/common';
import {VehicleService} from '../../../../../services/vehicle.service';
import {AddNewTodo} from '../../../../models/todo/addNewTodo';


// tslint:disable-next-line:class-name
export interface addTasksData {
  vehicleID: any;
  vehicleName: any;
  todoID: any;

}

export interface UserData {

  name: string;
  id: any;
}


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  providers: [DatePipe],
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  taskFormGroup: FormGroup;
  loader = false;
  getFormData: getAllUsers;
  hostHeaderInfo: hostHeaderInfo;
  users: UserData[];


  usersCtrl = new FormControl();
  filteredUsers: Observable<UserData[]>;
  userName: string[] = [];
  assignedUserIDs = [];
  public tagsData: AddTags;
  labels = [];
  tagIDs = [];
  tags = [];

  public NewTask: NewTask;
  resp: any;
  @Output() onSucess = new EventEmitter();
  public AddNewTodo: AddNewTodo;






  @ViewChild('usersInput', {static: false}) usersInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
      private _formBuilder: FormBuilder,
      public snackBar: MatSnackBar,
      public usersService: UsersService,
      public todoserviceService: TodoserviceService,
      public datepipe: DatePipe,
      public vehicleService: VehicleService,
      public dialogRef: MatDialogRef<AddTaskComponent>,

      @Inject(MAT_DIALOG_DATA) public data: addTasksData) {

    this.getFormData = new getAllUsers();
    this.hostHeaderInfo = new hostHeaderInfo();
    this.getFormData.hostHeaderInfo = new hostHeaderInfo();
    this.users = [];
    this.labels = [];
    this.assignedUserIDs = [];
    this.tagIDs = [];
    this.tagsData = new AddTags();
    this.tagsData.hostHeaderInfo = this.hostHeaderInfo;
    this.tags = [];
    this.NewTask = new NewTask();
    this.NewTask.hostHeaderInfo = this.hostHeaderInfo;
    this.AddNewTodo = new AddNewTodo();
    this.AddNewTodo.hostHeaderInfo = this.hostHeaderInfo;


    this.filteredUsers = this.usersCtrl.valueChanges
        .pipe(
            startWith(''),
            map(user => user ? this._filterUsers(user) : this.users.slice())
        );


  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllUsers();
    this.getTags();
    this.taskFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]

    });
  }

  addTask(): void{
    this.loader = true;
    this.NewTask.assignedUserIDs = this.assignedUserIDs;
    this.NewTask.companyID = this.usersService.getSession('companyInfo').id;
    this.NewTask.createdByUserID = this.usersService.getSession('userDetails').id;
    this.NewTask.name = this.taskFormGroup.get('name').value;
    this.NewTask.description = this.taskFormGroup.get('description').value;
    this.NewTask.startDate = this.datepipe.transform(this.taskFormGroup.get('startDate').value, 'MM-dd-yyyy');
    this.NewTask.dueDate = this.datepipe.transform(this.taskFormGroup.get('dueDate').value, 'MM-dd-yyyy');
    this.NewTask.tagIDs = this.tagIDs;
    this.NewTask.phaseID = 0;
    this.NewTask.vehicleID = this.data.vehicleID;
    this.NewTask.statusID = 1;
    this.NewTask.isActiveFlag = 1;


    this.vehicleService.updateTask(this.NewTask).then(res => {
      this.resp = res;
      if (this.resp.hostHeaderInfo.responseCode === '000'){
        this.onSucess.emit('000');
        this.showToast(this.resp.hostHeaderInfo.responseMessage);
      }else{
        this.loader = false;
        this.showToast(this.resp.hostHeaderInfo.responseMessage);

      }

    });


  }

  getAllUsers(): any {
    this.getFormData.compId = this.usersService.getSession('companyInfo').id;
    this.getFormData.type = 0;
    this.getFormData.searchType = 0;
    this.getFormData.id = this.usersService.getSession('userDetails').id;

    this.usersService.getAllCompanyUsers(this.getFormData).subscribe((data: any) => {
      let user = [];
      user = data;
      const count = user.length;
      for (let i = 0; i < count; i++) {
        this.users.push({name: user[i].profile.fname + ' ' + user[i].profile.sname, id: user[i].profile.id});
        console.log(this.users);
      }

    });
  }

  private _filterUsers(value: any): UserData[] {
    let filterValue;
    if (typeof value === 'string'){
      filterValue = value.toLowerCase();
    }else{
      filterValue = value.name.toLowerCase();
    }
    return this.users.filter(users => users.name.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.userName.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
    this.usersCtrl.setValue(null);
  }

  remove(username: string): void {
    const index = this.userName.indexOf(username);

    if (index >= 0) {
      this.userName.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.assignedUserIDs.push(event.option.value.id);
    this.userName.push(event.option.viewValue);
    this.usersInput.nativeElement.value = '';
    this.usersCtrl.setValue(null);
  }

  getTags(): void{
    this.tagsData.companyID = this.usersService.getSession('companyInfo').id;
    this.tagsData.isTask =  1;
    this.tagsData.isActiveFlag = true;
    this.tagsData.isVehicle = 1;
    this.todoserviceService.getTags(this.tagsData).subscribe((data) => {
      this.labels = data;

    });

  }

  addSelectedLabel(value): void{
    this.tagIDs.push(value.value.id);
    this.tags.push(value.value);
    const index = this.labels.indexOf(value.value);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  removeLabel(value): void {
    const index = this.tagIDs.indexOf(value.id);
    if (index >= 0) {
      this.tagIDs.splice(index, 1);
      this.tags.splice(index, 1);
    }
    this.labels.push(value);

  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  createTodo(){
    if(this.data.todoID === 0){

      this.AddNewTodo.companyID = this.usersService.getSession('companyInfo').id;
      this.AddNewTodo.createdByUserID = this.usersService.getSession('userDetails').id;
      this.AddNewTodo.name = this.data.vehicleName;
      this.AddNewTodo.description = '';
      this.AddNewTodo.todoID = 0;
      this.AddNewTodo.isActiveFlag = 1;
      this.AddNewTodo.phases = [];

      this.todoserviceService.addCompanyTodo(this.AddNewTodo).subscribe(data => {
        if (data.responseCode === '000') {
          this.NewTask.todoID = data.returnID;
          this.addTask();
        }else{
          this.onSucess.emit('E01');
        }
      });



    }else{
      this.NewTask.todoID = parseInt(this.data.todoID);
      this.addTask();
    }
  }

  onNoClick(){
    this.dialogRef.close();
  }




}
