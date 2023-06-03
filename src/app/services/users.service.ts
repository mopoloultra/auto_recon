
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url: any = '';
  headers: any;
  myheaders: any;
  constructor(public http: HttpClient, private snackBar: MatSnackBar) { 
    this.url = environment.url;     
    this.headers = new HttpHeaders();
    this.headers.set('Content-Type', 'application/json');
   
}


  inviteUser(userDetails): Observable<any>{
    return this.http.post<any>(this.url + 'api/v1/inviteUser', userDetails,
    { headers: this.getHeaders() })
    .pipe(map(data => data.hostHeaderInfo ),
    catchError (err => {
      console.log('invite user service err', err);
      return throwError(err);
    }));  

 }

 
/*  getUsers(user): Observable<any>{ 
  return this.http.post<any>(this.url + '' + user,
   { headers: this.getHeaders() }).pipe(
    catchError(err => {
        console.log('get Users error', err);
        return throwError(err);
    })
);
} */

getAllCompanyUsers(user): Observable<any>{ 
  
  return this.http.post<any>(this.url + 'api/v1/cmp/getCompanyUsers' , user, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.info),
    catchError(err => {
        console.log('get all company Users error', err);
        return throwError(err);
    })
);
}

  getCompanyUsers(user): Observable<any>{

    return this.http.post<any>(this.url + 'api/v1/cmp/getCompanyUsers' , user,
        { headers: this.getHeaders() })
        .pipe(map(data => data),
            catchError(err => {
              console.log('get all company Users error', err);
              return throwError(err);
            })
        );
  }



  getCompanyQuestions(user): Observable<any>{


    return this.http.post<any>(this.url + 'api/v1/cmp/getInspectionMultipointQuestionAdmin' , user,
        { headers: this.getHeaders() })
        .pipe(map(data => data),
            catchError(err => {
              console.log('get all company Users error', err);
              return throwError(err);
            })
        );
  }


  getCompanyVendors(user): Observable<any>{


    return this.http.post<any>(this.url + 'api/v1/cmp/getCompanyVendor' , user,
        { headers: this.getHeaders() })
        .pipe(map(data => data),
            catchError(err => {
              console.log('get all company Users error', err);
              return throwError(err);
            })
        );
  }


addCompanyRole(roleData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/roles/add', roleData, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.hostHeaderInfo ),
  catchError (err => {
    console.log('add companyRole service err', err);
    return throwError(err);
  }));  

}

getRoles(user): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/roles/all', user,
   { headers: this.getHeaders() })
  .pipe(map(data => data.roles ),
  catchError (err => {
    console.log('get Roles err=>', err);
    return throwError(err);
  }));  

}

getCompanies(user): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/cmp/getCompanies', user,
   { headers: this.getHeaders() })
  .pipe(map(data => data ),
  catchError (err => {
    console.log('get companies err=>', err);
    return throwError(err);
  }));  
}

addCompany(companyData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/cmp/createCompany', companyData, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.hostHeaderInfo ),
  catchError (err => {
    console.log('add company service err', err);
    return throwError(err);
  }));  

}

editRole(roleData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/roles/edit', roleData, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.hostHeaderInfo ),
  catchError (err => {
    console.log('edit role service err', err);
    return throwError(err);
  }));  

}

editProfileInfo(profileData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/profile/edit', profileData, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.hostHeaderInfo ),
  catchError (err => {
    console.log('edit profile info service err', err);
    return throwError(err);
  }));  

}

  editPic(profileData): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/profile/editPic', profileData,
        { headers: this.getHeaders() })
        .pipe(map(data => data.hostHeaderInfo ),
            catchError (err => {
              console.log('edit profile info service err', err);
              return throwError(err);
            }));

  }



getCompanyUserInfo(userData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/cmp/getCompanyUsers', userData, 
  { headers: this.getHeaders() })
  .pipe(map((data: any) => data.info.profileInfo ),
  catchError (err => {
    console.log('edit profile info service err', err);
    return throwError(err);
  }));  

}

editProfilePic(profileData): Observable<any>{
  return this.http.post<any>(this.url + 'v1/profile/editPic', profileData, 
  { headers: this.getHeaders() })
  .pipe(map((data: any) => data ),
  catchError (err => {
    console.log('edit profile pic service err', err);
    return throwError(err);
  }));  
}

completeSignUp(companyData): Observable<any>{
  return this.http.post<any>(this.url + 'api/v1/completeSignUp', companyData, 
  { headers: this.getHeaders() })
  .pipe(map(data => data.hostHeaderInfo ),
  catchError (err => {
    console.log('add company service err', err);
    return throwError(err);
  }));



}


  resetPassword(companyData): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/mng/resetPassword', companyData,
        { headers: this.getHeaders() })
        .pipe(map(data => data.hostHeaderInfo ),
            catchError (err => {
              console.log('add company service err', err);
              return throwError(err);
            }));



  }

showToast(message): void{
  this.snackBar.open(message, 'X', {
    duration: 3000,    
  });
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

  getHeaders(): HttpHeaders{
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Swift ' + this.getSession('userToken'),
    });

    return headers;
  }


}
