import {Component, OnInit, Inject, ɵConsole, ViewChild, Output, EventEmitter, Input, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AddTags} from '../../../../models/tags/addTags';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatDialog} from '@angular/material';
import {UserData} from '../vehicle-tasks.component';
import {getAllUsers} from '../../../../models/admin/users/get/getUsers';
import {NewTask} from '../../../../models/tasks/NewTask';
import {SubTasks} from '../../../../models/tasks/SubTasks';
import {VehicleService} from '../../../../../services/vehicle.service';
import {UsersService} from '../../../../../services/users.service';
import {TodoserviceService} from '../../../../../services/todoservice.service';
import {hostHeaderInfo} from '../../../../models/hostHeaderInfo';
import {map, startWith} from 'rxjs/operators';
import {ProcessingDialogComponent} from '../../dialogs/processing-dialog/processing-dialog.component';
import {MatChipInputEvent} from '@angular/material/chips';
import {AddTaskComponent} from '../../dialogs/add-task/add-task.component';

export interface updateData {
  task: any;
  vehicleID: any;


}

  @Component({
  selector: 'app-view-dialog',
  templateUrl: './view-dialog.component.html',
  styleUrls: ['./view-dialog.component.scss']
})
export class ViewDialogComponent implements OnInit {

    taskDetail: any;
    tasksFormGroup: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    public hostHeaderInfo: hostHeaderInfo;


    visible = true;
    selectable = true;
    removable = true;
    public tagsData: AddTags;
    labels = [];
    tagIDs = [];
    tags = [];
    subTasks = [];

    public getAllUsers: getAllUsers;
    users: UserData[];
    usersCtrl = new FormControl();
    filteredUsers: Observable<UserData[]>;
    userName: string[] = [];
    assignedUserIDs = [];
    @ViewChild('usersInput', {static: false}) usersInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
    public NewTask: NewTask;

    taskInfo: any;
    response: any;
    selectedIndex: any;
    todoID: any;
    subtask = new FormControl('', Validators.required);
    public SubTasks: SubTasks;
    resp: any;
    @Output() onSucess = new EventEmitter();

  constructor(
      public dialogRef: MatDialogRef<ViewDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: updateData,
      public vehicleService: VehicleService,
      public usersService: UsersService,
      public todoserviceService: TodoserviceService,
      public dialog: MatDialog,
      public _formBuilder: FormBuilder) {

    this.hostHeaderInfo = new hostHeaderInfo();
    this.tagIDs = [];
    this.tagsData = new AddTags();
    this.tagsData.hostHeaderInfo = this.hostHeaderInfo;
    this.tags = [];
    this.getAllUsers = new getAllUsers();
    this.getAllUsers.hostHeaderInfo = this.hostHeaderInfo;
    this.users = [];
    this.subTasks = [];
    this.NewTask = new NewTask();
    this.NewTask.hostHeaderInfo = this.hostHeaderInfo;
    this.SubTasks = new SubTasks();
    this.SubTasks.hostHeaderInfo = this.hostHeaderInfo;

    this.filteredUsers = this.usersCtrl.valueChanges
        .pipe(
            startWith(''),
            map(user => user ? this._filterUsers(user) : this.users.slice())
        );
  }

  ngOnInit() {

    this.getTags();
    this.getAllUser();

    this.taskDetail = this.data.task;
    this.tasksFormGroup = this._formBuilder.group({
      name: [this.data.task.name, Validators.required],
      description: [this.data.task.description],
      dueDate: [this.data.task.dueDate, Validators.required],
      startDate: [this.data.task.startDate, Validators.required]

    });

    this.tags = this.data.task.tags;

    const user = this.data.task.users;
    const userCount = user.length;

    for(let x = 0; x < userCount; x++){
      this.userName.push(user[x].fullName);
      this.assignedUserIDs.push(user[x].id);
    }

    this.subTasks = this.data.task.subTasks;

  }

  close(){
    this.dialogRef.close();
  }

    addSubTask(){
      const dialogRef = this.dialog.open(ProcessingDialogComponent, {
        width: '100px',
        height: '100px',
        disableClose: false
      });

      this.SubTasks.id = 0;
      this.SubTasks.isActiveFlag = true;
      this.SubTasks.isComplete = false;
      this.SubTasks.taskID = this.taskDetail.id;
      this.SubTasks.createdByUserID = this.usersService.getSession('userDetails').id;
      this.SubTasks.name = this.subtask.value;
      this.SubTasks.description = this.subtask.value;

      this.vehicleService.subTasks(this.SubTasks).then(resp => {
        this.resp = resp;
        if (this.resp.hostHeaderInfo.responseCode === '000'){

          dialogRef.close();
          this.onSucess.emit('000');
        }else{
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
        }

        console.log(resp);
      } );



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
        this.updateTask();
      }
    }

    removeLabel(value): void {
      const index = this.tagIDs.indexOf(value.id);
      if (index >= 0) {
        this.tagIDs.splice(index, 1);
        this.tags.splice(index, 1);
        this.updateTask();
      }
      this.labels.push(value);

    }

    getAllUser(): any {
      this.getAllUsers.compId = this.usersService.getSession('companyInfo').id;
      this.getAllUsers.type = 0;
      this.getAllUsers.searchType = 0;
      this.getAllUsers.id = this.usersService.getSession('userDetails').id;

      this.usersService.getAllCompanyUsers(this.getAllUsers).subscribe((data: any) => {
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
      this.updateTask();
    }

    remove(username: string): void {
      const index = this.userName.indexOf(username);

      if (index >= 0) {
        this.userName.splice(index, 1);
        this.updateTask();
      }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
      this.assignedUserIDs.push(event.option.value.id);
      this.userName.push(event.option.viewValue);
      this.usersInput.nativeElement.value = '';
      this.usersCtrl.setValue(null);
      this.updateTask();
    }

    updateSubtask(task, action: string): void{
      const dialogRef = this.dialog.open(ProcessingDialogComponent, {
        width: '100px',
        height: '100px',
        disableClose: false
      });

      this.SubTasks.id = task.id;
      this.SubTasks.isActiveFlag = false;
      this.SubTasks.isComplete = false;
      this.SubTasks.taskID = this.taskDetail.id;
      this.SubTasks.createdByUserID = this.usersService.getSession('userDetails').id;
      this.SubTasks.name = task.name;
      this.SubTasks.description = task.description;

      this.vehicleService.subTasks(this.SubTasks).then(resp => {
        this.resp = resp;
        if (this.resp.hostHeaderInfo.responseCode === '000'){

          dialogRef.close();
          this.onSucess.emit('000');


        }else{
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
        }

        console.log(resp);
      } );
    }

    getCompleteSubs(tasks: Array<any>): number{
      return tasks.filter(type => type['isCompleted'] === true).length;
    }

    updateTask(): void{

      const dialogRef = this.dialog.open(ProcessingDialogComponent, {
        width: '100px',
        height: '100px',
        disableClose: false
      });

      this.NewTask.description = this.tasksFormGroup.get('description').value;
      this.NewTask.taskID = this.taskDetail.id;
      this.NewTask.todoID = this.taskDetail.todoID;
      this.NewTask.name = this.tasksFormGroup.get('name').value;
      this.NewTask.statusID = 1;
      this.NewTask.vehicleID = this.data.vehicleID;
      this.NewTask.phaseID = 0;
      this.NewTask.tagIDs = this.tagIDs;
      this.NewTask.assignedUserIDs = this.assignedUserIDs;
      this.NewTask.dueDate = this.tasksFormGroup.get('dueDate').value;
      this.NewTask.companyID = this.usersService.getSession('companyInfo').id;
      this.NewTask.createdByUserID = this.usersService.getSession('userDetails').id;
      this.NewTask.startDate = this.tasksFormGroup.get('startDate').value;



      this.vehicleService.updateTask(this.NewTask).then(resp => {
        this.response = resp;
        if (this.response.hostHeaderInfo.responseCode === '000'){
          this.usersService.showToast(this.response.hostHeaderInfo.responseMessage);
          dialogRef.close();
          this.onSucess.emit('000');
        }else{
          this.usersService.showToast(this.response.hostHeaderInfo.responseMessage);
          dialogRef.close();
        }

        console.log(resp);
      } );


    }




    markSubTask(task): void{
      const dialogRef = this.dialog.open(ProcessingDialogComponent, {
        width: '100px',
        height: '100px',
        disableClose: false
      });

      this.SubTasks.id = task.id;
      this.SubTasks.isActiveFlag = true;
      this.SubTasks.isComplete = !task.isCompleted;
      this.SubTasks.taskID = this.taskDetail.id;
      this.SubTasks.createdByUserID = this.usersService.getSession('userDetails').id;
      this.SubTasks.name = task.name;
      this.SubTasks.description = task.description;

      this.vehicleService.subTasks(this.SubTasks).then(resp => {
        this.resp = resp;
        if (this.resp.hostHeaderInfo.responseCode === '000'){

          console.log(this.taskDetail)


          dialogRef.close();
          this.onSucess.emit('000');



        }else{
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
        }

        console.log(resp);
      } );
    }






  }
