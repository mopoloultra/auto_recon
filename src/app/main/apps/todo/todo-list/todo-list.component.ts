import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { Todo } from 'app/main/apps/todo/todo.model';
import { TodoService } from 'app/main/apps/todo/todo.service';
import { takeUntil } from 'rxjs/operators';
import {TodoserviceService} from '../../../../services/todoservice.service';
import { hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {GetTodoData} from '../../../models/todo/getTodo';
import {UsersService} from '../../../../services/users.service';
import {GetTasks} from '../../../models/todo/getTasks';
import {Router} from '@angular/router';


@Component({
    selector     : 'todo-list',
    templateUrl  : './todo-list.component.html',
    styleUrls    : ['./todo-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class TodoListComponent implements OnInit, OnDestroy
{
    todos: Todo[];
    currentTodo: Todo;
    hostHeaderInfo: hostHeaderInfo;
    GetTodoData: GetTodoData;
    loading = false;
    noTodosData = false;
    public GetTasks: GetTasks;


    private respCode: string;


    // Private
    private _unsubscribeAll: Subject<any>;
    searchText: any;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {TodoService} _todoService
     * @param {Location} _location
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _todoService: TodoService,
        private _location: Location,
        private todoserviceService: TodoserviceService,
        private usersService: UsersService,
        private router: Router
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.GetTodoData = new GetTodoData();
        this.GetTodoData.hostHeaderInfo = this.hostHeaderInfo;
        this.todos = [];
        this.GetTasks = new GetTasks();
        this.GetTasks.hostHeaderInfo = this.hostHeaderInfo;
        this.searchText = '';



    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getTodos();
        // Subscribe to update todos on changes
        // this._todoService.onTodosChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(todos => {
        //         this.todos = todos;
        //         console.log(this.todos);
        //     });

        // // Subscribe to update current todo on changes
        // this._todoService.onCurrentTodoChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(currentTodo => {
        //         if ( !currentTodo )
        //         {
        //             // Set the current todo id to null to deselect the current todo
        //             this.currentTodo = null;
        //
        //             // Handle the location changes
        //             const tagHandle    = this._activatedRoute.snapshot.params.tagHandle,
        //                   filterHandle = this._activatedRoute.snapshot.params.filterHandle;
        //
        //             if ( tagHandle )
        //             {
        //                 this._location.go('apps/todo/tag/' + tagHandle);
        //             }
        //             else if ( filterHandle )
        //             {
        //                 this._location.go('apps/todo/filter/' + filterHandle);
        //             }
        //             else
        //             {
        //                 this._location.go('apps/todo/all');
        //             }
        //         }
        //         else
        //         {
        //             this.currentTodo = currentTodo;
        //         }
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read todo
     *
     * @param todoId
     */
    readTodo(todoId): void
    {
        // Set current todo
        this.GetTasks.todoID = todoId;
        this.GetTasks.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTasks.userID = this.usersService.getSession('userDetails').id;
        this.GetTasks.isActiveFlag = 0;
        this.GetTasks.vehicleID = 0;
        this.GetTasks.status = 0;
        const scrumData = JSON.stringify(this.GetTasks);

        // if (localStorage.getItem('scrumData')){
        //     localStorage.removeItem('scrumData');
        //     localStorage.setItem('scrumData', scrumData);
        // }else{
        //     localStorage.setItem('scrumData', scrumData);
        // }

        this.router.navigate(['/apps/todo/task-view/' + todoId ]);
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void
    {

    }

    getTodos(): void
    {
        this.loading = true;
        this.GetTodoData.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTodoData.todoID = 0;
        this.todoserviceService.getCompanyTodo(this.GetTodoData).subscribe((data: any) => {
            console.log(data);
            if (data) {
                this.loading = false;
                this.todos = data;
            }else{
                this.noTodosData = true;
            }



        });
    }



    @Input() set setRespCode(value: string) {

        this.respCode = value;
        if(this.respCode === '000'){
            this.getTodos();
        }


    }

    get categoryId(): string {

        return this.respCode;

    }
}
