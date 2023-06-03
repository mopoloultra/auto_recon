import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  url: any = '';
  headers: any;

  constructor(public http: HttpClient, private snackBar: MatSnackBar) { }

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
              console.log('edit profile info service err', err);
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
