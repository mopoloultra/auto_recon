import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import {UsersService} from './users.service';
import {GetTasks} from '../main/models/tasks/GetTasks';
import {hostHeaderInfo} from '../main/models/hostHeaderInfo';

@Injectable({
  providedIn: 'root'
})
export class TodoserviceService {
  url: any = '';
  headers: any;

  public GetTasks: GetTasks;
  public hostHeaderInfo: hostHeaderInfo;

  constructor(public http: HttpClient, private snackBar: MatSnackBar, public usersService: UsersService) {
    this.url = environment.url;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetTasks = new GetTasks();
    this.GetTasks.hostHeaderInfo = this.hostHeaderInfo;

  }

  getHeaders(): HttpHeaders{
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Swift ' + this.getSession('userToken'),
    });

    return headers;
  }

  getCompanyTodo(todoData): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/todo/getTodo', todoData,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data.tasks.listOfTodos ),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }



    getTasks(): Observable<any>{
      this.GetTasks.vehicleID = 0;
      this.GetTasks.todoID = 0;
      this.GetTasks.status = 1;
      this.GetTasks.isActiveFlag = 1;
      this.GetTasks.companyID = this.usersService.getSession('companyInfo').id;
      this.GetTasks.userID = this.usersService.getSession('userDetails').id;
      return this.http.post<any>(this.url + '/api/v1/tasks/getTask', this.GetTasks,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data ),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getActivities(): Observable<any>{
        this.GetTasks.vehicleID = 0;
        this.GetTasks.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTasks.createdByUserID = 0;
        return this.http.post<any>(this.url + 'api/v1/cmp/getActivityHistory', this.GetTasks,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data ),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getVehivleActivities(vehicleID): Observable<any>{
        this.GetTasks.vehicleID = vehicleID;
        this.GetTasks.companyID = this.usersService.getSession('companyInfo').id;
        this.GetTasks.createdByUserID = 0;
        return this.http.post<any>(this.url + 'api/v1/cmp/getActivityHistory', this.GetTasks,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data ),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getTags(todoData): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/tag/getTag', todoData,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data.tags),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

  addCompanyTodo(todoData): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/todo/createUpdateTodo', todoData,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data.hostHeaderInfo ),
            catchError (err => {
              console.log(err);
              return throwError(err);
            }));

  }

  addTag(todoData): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/tag/createUpdateTag', todoData,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data.hostHeaderInfo ),
            catchError (err => {
              console.log(err);
              return throwError(err);
            }));

  }

    updateCardPhase(todoData): Observable<any>{
        alert('calling');
        return this.http.post<any>(this.url + '/api/v1/tasks/updateTaskPhase', todoData,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data.hostHeaderInfo ),
                catchError (err => {
                    console.log(err);
                    return throwError(err);
                }));

    }

  getSession(key: string): any{
    const stringifiedValue = sessionStorage.getItem(key);
    try {
      const obj = JSON.parse(stringifiedValue);
      return obj;

    } catch (error) {
      return stringifiedValue;
    }

  }
}

