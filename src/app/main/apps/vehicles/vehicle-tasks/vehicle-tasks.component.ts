import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../../../../services/users.service';
import {VehicleService} from '../../../../services/vehicle.service';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {GetTask} from '../../../models/vehicles/getTask';
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import {TodoserviceService} from '../../../../services/todoservice.service';
import {AddTags} from '../../../models/tags/addTags';
import {getAllUsers} from '../../../models/admin/users/get/getUsers';
import {Observable} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {NewTask} from '../../../models/tasks/NewTask';
import {ProcessingDialogComponent} from '../dialogs/processing-dialog/processing-dialog.component';
import {MatDialog} from '@angular/material';
import {AddTaskComponent} from '../dialogs/add-task/add-task.component';
import {SubTasks} from '../../../models/tasks/SubTasks';
import {ViewDialogComponent} from './view-dialog/view-dialog.component';


export interface UserData {

  name: string;
  id: any;
}

@Component({
  selector: 'app-vehicle-tasks',
  templateUrl: './vehicle-tasks.component.html',
  styleUrls: ['./vehicle-tasks.component.scss']
})
export class VehicleTasksComponent implements OnInit {

  @Input() vehicleID: any;
  @Input() vehicleName: any;
  @Input() todoId: any;
  public hostHeaderInfo: hostHeaderInfo;
  public GetTask: GetTask;
  colWidth = 100;
  infoColWidth = 0;
  listOfTasks: Array<any>;
  loader = false;
  isData = false;
  showInfo = false;
  taskDetail: any;
  tasksFormGroup: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() modalView = false;

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

  searchText: any;

  constructor(public vehicleService: VehicleService,
              public usersService: UsersService,
              public todoserviceService: TodoserviceService,
              public dialog: MatDialog,
              public _formBuilder: FormBuilder) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetTask = new GetTask();
    this.GetTask.hostHeaderInfo = this.hostHeaderInfo;
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
    this.searchText = '';



    this.filteredUsers = this.usersCtrl.valueChanges
        .pipe(
            startWith(''),
            map(user => user ? this._filterUsers(user) : this.users.slice())
        );
  }

  ngOnInit(): void {

    this.getTasks();
    this.getTags();
    this.getAllUser();

  }

  getTasks(): void{

    this.loader = true;
    this.isData = false;
    this.GetTask.vehicleID = this.vehicleID;
    this.GetTask.userID = this.usersService.getSession('userDetails').id;
    this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
    this.GetTask.isActiveFlag = 1;
    this.GetTask.status = 1;
    this.GetTask.isActiveFlag = 1;
    if(this.todoId){
      this.GetTask.todoID = this.todoId;
    }else{
      this.GetTask.todoID = 0;
    }


    this.vehicleService.getTask(this.GetTask).subscribe(resp => {
      console.log(resp);



      if(resp.hostHeaderInfo.responseCode === '000'){
        this.loader = false;
        this.isData = true;
        this.listOfTasks = resp.tasks.listOfTasks;
      }else{
        this.loader = false;
        this.isData = false;
      }

      if(this.listOfTasks){
        this.todoID = this.listOfTasks[0].todoID;
      }else{
        this.todoID = 0;
      }



    },error => {
      this.loader = false;
      this.isData = false;
    });
  }

  viewInfo(task , myIndex: number): void{
    if(!this.modalView){
      this.selectedIndex = myIndex;
      this.userName = [];
      this.assignedUserIDs = [];
      this.tagIDs = [];
      this.showInfo = true;
      this.colWidth = 60;
      this.infoColWidth = 40;
      this.taskDetail = task;
      this.tasksFormGroup = this._formBuilder.group({
        name: [task.name, Validators.required],
        description: [task.description],
        dueDate: [task.dueDate, Validators.required],
        startDate: [task.startDate, Validators.required]

      });

      this.tags = task.tags;

      const user = task.users;
      const userCount = user.length;

      for(let x = 0; x < userCount; x++){
        this.userName.push(user[x].fullName);
        this.assignedUserIDs.push(user[x].id);
      }

      this.subTasks = task.subTasks;
      console.log(task);
    }else{
      this.selectedIndex = myIndex;
      const  dialogEdit = this.dialog.open(ViewDialogComponent, {
        data: {task: task, vehicleID: this.vehicleID},
        width: '50vw',
        height: '70vh'
      });

      dialogEdit.componentInstance.onSucess.subscribe(res => {
        console.log(res);
        if (res){
          console.log( dialogEdit.componentInstance.taskDetail)
          this.GetTask.vehicleID = this.vehicleID;
          this.GetTask.userID = this.usersService.getSession('userDetails').id;
          this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
          this.GetTask.isActiveFlag = 1;
          this.GetTask.status = 1;
          this.GetTask.isActiveFlag = 1;
          if(this.todoId){
            this.GetTask.todoID = this.todoId;
          }else{
            this.GetTask.todoID = 0;
          }


          this.vehicleService.getTask(this.GetTask).subscribe(resp => {

            if(resp.hostHeaderInfo.responseCode === '000'){
              this.listOfTasks = resp.tasks.listOfTasks;
              dialogEdit.componentInstance.taskDetail = this.listOfTasks[this.selectedIndex];
              console.log(this.listOfTasks[this.selectedIndex]);


            }
          });

        }
      });


    }



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


        this.GetTask.vehicleID = this.vehicleID;
        this.GetTask.userID = this.usersService.getSession('userDetails').id;
        this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTask.isActiveFlag = 1;
        this.GetTask.status = 1;
        this.GetTask.isActiveFlag = 1;
        if(this.todoId){
          this.GetTask.todoID = this.todoId;
        }else{
          this.GetTask.todoID = 0;
        }


        this.vehicleService.getTask(this.GetTask).subscribe(resp => {
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
          if(resp.hostHeaderInfo.responseCode === '000'){

            this.listOfTasks = resp.tasks.listOfTasks;
            this.subTasks = this.listOfTasks[this.selectedIndex].subTasks;

          }
        });


      }else{
        this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
        dialogRef.close();
      }

      console.log(resp);
    } );



  }

  closeInfo(): void{
    this.showInfo = false;
    this.colWidth = 100;
    this.infoColWidth = 0;

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


        this.GetTask.vehicleID = this.vehicleID;
        this.GetTask.userID = this.usersService.getSession('userDetails').id;
        this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTask.isActiveFlag = 1;
        this.GetTask.status = 1;
        this.GetTask.isActiveFlag = 1;
        if(this.todoId){
          this.GetTask.todoID = this.todoId;
        }else{
          this.GetTask.todoID = 0;
        }

        this.vehicleService.getTask(this.GetTask).subscribe(resp => {
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
          if(resp.hostHeaderInfo.responseCode === '000'){

            this.listOfTasks = resp.tasks.listOfTasks;
            this.subTasks = this.listOfTasks[this.selectedIndex].subTasks;

          }
        });


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
    this.NewTask.vehicleID = this.vehicleID;
    this.NewTask.phaseID = 0;
    this.NewTask.tagIDs = this.tagIDs;
    this.NewTask.assignedUserIDs = this.assignedUserIDs;
    this.NewTask.dueDate = this.tasksFormGroup.get('dueDate').value;
    this.NewTask.companyID = this.usersService.getSession('companyInfo').id;
    this.NewTask.createdByUserID = this.usersService.getSession('userDetails').id;
    this.NewTask.startDate = this.tasksFormGroup.get('startDate').value;

    this.listOfTasks[this.selectedIndex].description = this.tasksFormGroup.get('description').value;
    this.listOfTasks[this.selectedIndex].taskID = this.taskDetail.id;
    this.listOfTasks[this.selectedIndex].todoID = this.taskDetail.todoID;
    this.listOfTasks[this.selectedIndex].name = this.tasksFormGroup.get('name').value;
    this.listOfTasks[this.selectedIndex].tagIDs = this.tagIDs;
    this.listOfTasks[this.selectedIndex].assignedUserIDs = this.assignedUserIDs;
    this.listOfTasks[this.selectedIndex].dueDate = this.tasksFormGroup.get('dueDate').value;
    this.listOfTasks[this.selectedIndex].startDate = this.tasksFormGroup.get('startDate').value;

    this.vehicleService.updateTask(this.NewTask).then(resp => {
      this.response = resp;
      if (this.response.hostHeaderInfo.responseCode === '000'){
        this.usersService.showToast(this.response.hostHeaderInfo.responseMessage);
        dialogRef.close();
      }else{
        this.usersService.showToast(this.response.hostHeaderInfo.responseMessage);
        dialogRef.close();
      }


    } );


  }


  addTask(){

    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '650px',
      data: {vehicleID: this.vehicleID, vehicleName: this.vehicleName, todoID: this.todoID}
    });

    dialogRef.componentInstance.onSucess.subscribe( res => {
      if (res === '000'){

        this.GetTask.vehicleID = this.vehicleID;
        this.GetTask.userID = this.usersService.getSession('userDetails').id;
        this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTask.isActiveFlag = 1;
        this.GetTask.status = 1;
        this.GetTask.isActiveFlag = 1;
        if(this.todoId){
          this.GetTask.todoID = this.todoId;
        }else{
          this.GetTask.todoID = 0;
        }

        this.vehicleService.getTask(this.GetTask).subscribe(resp => {
          this.usersService.showToast('SUCCESS');
          dialogRef.close();
          if(resp.hostHeaderInfo.responseCode === '000'){
            this.isData = true;
            this.listOfTasks = resp.tasks.listOfTasks;


          }
        });



      }
      else if (res === 'E01'){
        this.usersService.showToast('Unable to create Todo');
        dialogRef.close();

      }
    });
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


        this.GetTask.vehicleID = this.vehicleID;
        this.GetTask.userID = this.usersService.getSession('userDetails').id;
        this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTask.isActiveFlag = 1;
        this.GetTask.status = 1;
        this.GetTask.isActiveFlag = 1;
        if(this.todoId){
          this.GetTask.todoID = this.todoId;
        }else{
          this.GetTask.todoID = 0;
        }

        this.vehicleService.getTask(this.GetTask).subscribe(resp => {
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
          if(resp.hostHeaderInfo.responseCode === '000'){

            this.listOfTasks = resp.tasks.listOfTasks;
            this.subTasks = this.listOfTasks[this.selectedIndex].subTasks;

          }
        });


      }else{
        this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
        dialogRef.close();
      }

      console.log(resp);
    } );
  }

  upDateTaskStatus(task, index, event): void{

  this.NewTask.taskID = task.id;
  this.NewTask.createdByUserID = this.usersService.getSession('userDetails').id;
  if(event.checked){
    this.NewTask.statusID = 3;
  }else{
    this.NewTask.statusID = 1;
  }

    const dialogRef = this.dialog.open(ProcessingDialogComponent, {
      width: '100px',
      height: '100px',
      disableClose: false
    });

    this.vehicleService.updateTaskStatus(this.NewTask).subscribe(resp => {
      this.resp = resp;
      if (this.resp.hostHeaderInfo.responseCode === '000'){


        this.GetTask.vehicleID = this.vehicleID;
        this.GetTask.userID = this.usersService.getSession('userDetails').id;
        this.GetTask.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTask.isActiveFlag = 1;
        this.GetTask.status = 1;
        this.GetTask.isActiveFlag = 1;
        if(this.todoId){
          this.GetTask.todoID = this.todoId;
        }else{
          this.GetTask.todoID = 0;
        }

        this.vehicleService.getTask(this.GetTask).subscribe(resp => {
          this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
          dialogRef.close();
          if(resp.hostHeaderInfo.responseCode === '000'){

            this.listOfTasks = resp.tasks.listOfTasks;


          }
        });


      }else{
        this.usersService.showToast(this.resp.hostHeaderInfo.responseMessage);
        dialogRef.close();
      }

      console.log(resp);
    } );

    console.log(this.NewTask)


  }



}
