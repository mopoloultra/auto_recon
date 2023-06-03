import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import {UsersService} from '../../../../services/users.service';
import {TodoserviceService} from '../../../../services/todoservice.service';
import {AddNewTodo} from '../../../models/todo/addNewTodo';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  todoForm: FormGroup;
  public hostHeaderInfo: hostHeaderInfo;
  public AddNewTodo: AddNewTodo;
  loader = false;
  @Output() onSucess = new EventEmitter();
  phasesSelected = [];


  constructor(
      private _formBuilder: FormBuilder,
      private todoserviceService: TodoserviceService,
      private usersService: UsersService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<AddTodoComponent>
  ) {
    this.hostHeaderInfo = new hostHeaderInfo();
    this.AddNewTodo = new AddNewTodo();
    this.AddNewTodo.hostHeaderInfo = this.hostHeaderInfo;
  }

  ngOnInit() {



    this.todoForm = this._formBuilder.group({
      name: [ '', Validators.required],
      description: [''],
      isActiveFlag: [ ''],
      phases: new FormArray([
        new FormControl('', Validators.required)
      ])

    });
  }

  get phases(): FormArray {
    return this.todoForm.get('phases') as FormArray;
  }

  addTodo(): void {
    this.loader = true;
    this.AddNewTodo.companyID = this.usersService.getSession('companyInfo').id;
    this.AddNewTodo.createdByUserID = this.usersService.getSession('userDetails').id;
    this.AddNewTodo.name = this.todoForm.get('name').value;
    this.AddNewTodo.description = this.todoForm.get('description').value;
    this.AddNewTodo.todoID = 0;
    if (this.todoForm.get('isActiveFlag').value){
      this.AddNewTodo.isActiveFlag = 1;
    }else{
      this.AddNewTodo.isActiveFlag = 0;
    }
    for (let i = 0; i < this.phases.length; i++) {
      this.phasesSelected.push(this.phases.at(i).value);
      this.AddNewTodo.phases = this.phasesSelected;

    }

    this.todoserviceService.addCompanyTodo(this.AddNewTodo).subscribe(data => {
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


  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
    });
  }

  addPahseField(): void{
    this.phases.push(new FormControl('', Validators.required));
  }

  deletePhasesField(index: number): void {
    if (this.phases.length !== 1) {
      this.phases.removeAt(index);
    }
  }





}

