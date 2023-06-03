import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import {hostHeaderInfo} from '../../models/hostHeaderInfo';
import {UsersService} from '../../../services/users.service';
import {GetCompanyInfo} from '../../models/settings/GetCompanyInfo';
import {Resolve} from '@angular/router';
import {VehicleService} from '../../../services/vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  url: any = '';
  headers: any;

  onCompanyInfoChange: BehaviorSubject<any>;
  onCompanyData: BehaviorSubject<any>;
  public hostHeaderInfo: hostHeaderInfo;
  public GetCompanyInfo: GetCompanyInfo;

  constructor(public http: HttpClient, private snackBar: MatSnackBar, public usersService: UsersService) {
    this.url = environment.url;
    this.onCompanyInfoChange = new BehaviorSubject([]);
    this.onCompanyData = new BehaviorSubject([]);
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetCompanyInfo = new GetCompanyInfo();
    this.GetCompanyInfo.hostHeaderInfo = this.hostHeaderInfo;
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

  getErrors(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/exceptions/getExceptions', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.warn(err);
              return throwError(err);
            }));

  }


    saveInspectionMultipointQuestionAdmin(payload): Observable<any>{
        return this.http.post<any>(this.url + 'api/v1/cmp/saveInspectionMultipointQuestionAdmin', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }


    saveUpdateCompanyVendor(payload): Observable<any>{
        return this.http.post<any>(this.url + 'api/v1/cmp/saveUpdateCompanyVendor', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }

    getCompanyVendorType(compID): Observable<any>{
        this.GetCompanyInfo.companyID = compID;
        const payLOads = {
            hostHeaderInfo: this.hostHeaderInfo,
            companyID: compID
        };
        return this.http.post<any>(this.url + 'api/v1/cmp/getCompanyVendorType', payLOads,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }


    getQuestionTypes(compID): Observable<any>{
        this.GetCompanyInfo.companyID = compID;
        const payLOads = {
            hostHeaderInfo: this.hostHeaderInfo,
            companyID: compID
        };
        return this.http.post<any>(this.url + 'api/v1/inspection/getInspectionMultipointQuestionType', payLOads,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }

  addCompanyLogo(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/cmp/editCompanyLogo', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.warn(err);
              return throwError(err);
            }));

  }


  getCompanySteps(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/cmp/getCompanyStepAllowedPeriod', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.warn(err);
              return throwError(err);
            }));

  }

    updateSteps(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/cmp/saveUpdateCompanyStepAllowedPeriod', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }


  updateDateCompanyInfo(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/cmp/editCompanyInfo', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.warn(err);
              return throwError(err);
            }));

  }

    userPermissions(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/roles/saveUpdateRolePermission', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));

    }


    getCompanyInfoByID(companyID): Observable<any>{
        this.GetCompanyInfo.id = companyID;
        return this.http.post<any>(this.url + '/api/v1/cmp/getCompanyInfo', this.GetCompanyInfo,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));
    }


    addAnnouncement(payload): Observable<any>{

        return this.http.post<any>(this.url + '/api/v1/cmp/saveUpdateCompanyAnnoucement', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));
    }

    getAnnouncement(payload): Observable<any>{

        return this.http.post<any>(this.url + '/api/v1/cmp/getCompanyAnnouncement', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.warn(err);
                    return throwError(err);
                }));
    }



    getCompanyInfo(): Promise<any>
  {
    this.GetCompanyInfo.id = this.usersService.getSession('companyInfo').id;
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/v1/cmp/getCompanyInfo', this.GetCompanyInfo, {headers: this.getHeaders() })
          .subscribe((response: any) => {
            this.onCompanyInfoChange.next(response);
            resolve(response);
          }, reject);
    });
  }

  getCompanies(): Promise<any>{
      if (this.usersService.getSession('userDetails').isSuper){
          this.GetCompanyInfo.id = this.usersService.getSession('userDetails').id;
          return new Promise((resolve, reject) => {
              this.http.post(this.url + '/api/v1/cmp/getCompanies', this.GetCompanyInfo, {headers: this.getHeaders() })
                  .subscribe((response: any) => {
                      this.onCompanyData.next(response);
                      resolve(response);
                  }, reject);
          });
      }
  }



}

@Injectable()
export class CompanyInfoResolve implements Resolve<any>
{

  constructor(private settingsService: SettingsService)
  {}

  resolve(): Promise<any>
  {
    return this.settingsService.getCompanyInfo();
  }


}


@Injectable()
export class CompanyDataResolve implements Resolve<any>
{

    constructor(private settingsService: SettingsService)
    {}

    resolve(): Promise<any>
    {
        return this.settingsService.getCompanies();
    }


}
