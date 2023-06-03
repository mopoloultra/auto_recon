import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import {GetVehicle} from '../main/models/vehicles/GetVehicle';
import {hostHeaderInfo} from '../main/models/hostHeaderInfo';
import {UsersService} from './users.service';
import {ActivatedRouteSnapshot, Resolve, Router, ActivatedRoute} from '@angular/router';
import {InspectionTypes} from '../main/models/vehicles/InspectionTypes';
import {Inspections} from '../main/models/vehicles/Inspections';
import {DashboardStats} from '../main/models/dashboard/DashboardStats';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  url: any = '';
  headers: any;


  public hostHeaderInfo: hostHeaderInfo;
  public GetVehicle: GetVehicle;
  public InspectionTypes: InspectionTypes;
  public Inspections: Inspections;
  public DashboardStats: DashboardStats;

  onVehicleChange: BehaviorSubject<any>;
  onPhasesChange: BehaviorSubject<any>;
  onDocTypeChange: BehaviorSubject<any>;
  onInspectionTypeChange: BehaviorSubject<any>;
  onQuestionTypeChange: BehaviorSubject<any>;
  onActiveInspectionChange: BehaviorSubject<any>;
  onStatsChange: BehaviorSubject<any>;
  actionBody: any;

  constructor(public http: HttpClient, private snackBar: MatSnackBar, public usersService: UsersService, public _activatedRoute: ActivatedRoute) {
    this.url = environment.url;
    this.hostHeaderInfo = new hostHeaderInfo();
    this.GetVehicle = new GetVehicle();
    this.InspectionTypes = new InspectionTypes();
    this.GetVehicle.hostHeaderInfo = this.hostHeaderInfo;
    this.InspectionTypes.hostHeaderInfo = this.hostHeaderInfo;
    this.onPhasesChange = new BehaviorSubject([]);
    this.onVehicleChange = new BehaviorSubject([]);
    this.onDocTypeChange = new BehaviorSubject([]);
    this.onQuestionTypeChange = new BehaviorSubject([]);
    this.onInspectionTypeChange = new BehaviorSubject([]);
    this.onActiveInspectionChange = new BehaviorSubject([]);
    this.onStatsChange = new BehaviorSubject([]);
    this.Inspections = new Inspections();
    this.Inspections.hostHeaderInfo = this.hostHeaderInfo;
    this.DashboardStats = new DashboardStats();
    this.DashboardStats.hostHeaderInfo = this.hostHeaderInfo;

    if (!this.actionBody){
        this.actionBody = {
            hostHeaderInfo: {
                channel : 'web',
                sourceCode : 'xxx',
                token : 'xxxxx'
            }

        };
    }



  }

  getHeaders(): HttpHeaders{
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Swift ' + this.getSession('userToken'),
    });

    return headers;
  }



  getCompanyVehicles(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/vehicle/getVehicleByCompany', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

   }


  updateVehiclePhase(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/vehicle/updateVehicleMoveStep', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }

  getDocuments(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/document/getDocumentByType', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }

  getMultiPointQuestions(vehicleID, inspectionTypeID, inspectionType): Observable<any>{
      this.Inspections.vehicleID = vehicleID;
      this.Inspections.inspectionTypeID = inspectionType;
      this.Inspections.inspectionID = inspectionTypeID;
      this.Inspections.companyID = this.usersService.getSession('companyInfo').id;
      return this.http.post<any>(this.url + '/api/v1/inspection/getInspectionMultipointQuestion', this.Inspections,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }


  addNewDocument(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/document/createUpdateDocument', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }

    saveInspectionMultipointImages(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/inspection/saveInspectionMultipointImages', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getTask(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/tasks/getTask', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }


    getNotesByType(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/note/getNoteTypes', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    vehicleFav(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/vehicle/updateVehicleFav', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    saveNote(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/note/createUpdateNote', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getNote(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/note/getNotesByType', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    saveInspectionMultipointAnswer(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/inspection/saveInspectionMultipointAnswer', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }



    vehicleTag(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/vehicle/updateVehicleTag', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }


    getVehicleNotes(vehicleID): Observable<any>
    {

        this.DashboardStats.companyID = this.usersService.getSession('companyInfo').id;
        this.DashboardStats.createdByUserID = this.usersService.getSession('userDetails').id;
        this.DashboardStats.vehicleID = vehicleID;

        return this.http.post<any>(this.url + '/api/v1/note/getNotesToSelf', this.DashboardStats,
            {headers: this.getHeaders()})
            .pipe(map((data: any) => data),
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }));

    }



    getMenuBadges(): Observable<any>
    {

        if(this.usersService.getSession('companyInfo')){
            this.DashboardStats.companyID = this.usersService.getSession('companyInfo').id;
        }else{
            this.DashboardStats.companyID = 0;
        }



        return this.http.post<any>(this.url + '/api/v1/cmp/getCompanyBadges', this.DashboardStats,
            {headers: this.getHeaders()})
            .pipe(map((data: any) => data),
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }));

    }

    getVehicleHotList(): Observable<any>
        {

            this.DashboardStats.companyID = this.usersService.getSession('companyInfo').id;
            this.DashboardStats.userID = this.usersService.getSession('userDetails').id;
            this.DashboardStats.vehicleID = 0;

            return this.http.post<any>(this.url + '/api/v1/vehicle/getVehicleHotList', this.DashboardStats,
                {headers: this.getHeaders()})
                .pipe(map((data: any) => data),
                    catchError(err => {
                        console.log(err);
                        return throwError(err);
                    }));

        }



        getInspectionImages(vehicleID): Observable<any>{
        this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
        this.GetVehicle.vehicleID = vehicleID;
        return this.http.post<any>(this.url + '/api/v1/document/getDocumentTypeListingForInspection', this.GetVehicle,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }


    getVehicleTags(): Observable<any>{
        this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
        this.GetVehicle.isActiveFlag = true;
        this.GetVehicle.isVehicle = true;
        return this.http.post<any>(this.url + '/api/v1/tag/getTag', this.GetVehicle,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }






  createInspection(payload): Observable<any>{
    return this.http.post<any>(this.url + '/api/v1/inspection/createInspection', payload,
        { headers: this.getHeaders() })
        .pipe(map((data: any) => data),
            catchError (err => {
              console.log( err);
              return throwError(err);
            }));

  }

    saveInspectionMultipointAction(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/inspection/saveInspectionMultipointAction', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }

    getInspectionActions(): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/inspection/getInspectionActionType', this.actionBody,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
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

  getVehicle(vehicleID): Promise<any>
  {
    this.GetVehicle.phaseID = 0;
    this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
    this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
    this.GetVehicle.vehicleID = vehicleID;

    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/v1/vehicle/getVehicleByCompany', this.GetVehicle, {headers: this.getHeaders() })
          .subscribe((response: any) => {
            this.onVehicleChange.next(response);
            resolve(response);
          }, reject);
    });
  }

    getDashboardStats(): Promise<any>
    {

        this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
        this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
        this.GetVehicle.vehicleID = 0;

        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/vehicle/getVehicleStepsStatsByCompany', this.GetVehicle, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onStatsChange.next(response);
                    resolve(response);
                }, reject);
        });
    }


    subTasks(todoData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/tasks/createUpdateSubTask' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }

    updateTask(todoData){
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/tasks/createNewTask' , todoData, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }


    updateTaskStatus(payload): Observable<any>{
        return this.http.post<any>(this.url + '/api/v1/tasks/updateTaskStatus', payload,
            { headers: this.getHeaders() })
            .pipe(map((data: any) => data),
                catchError (err => {
                    console.log( err);
                    return throwError(err);
                }));

    }



  getVehicleVehiclePhases(): Promise<any>
  {
    this.GetVehicle.phaseID = 0;
    this.GetVehicle.companyID = this.usersService.getSession('companyInfo').id;
    this.GetVehicle.userID = this.usersService.getSession('userDetails').id;
    this.GetVehicle.vehicleID = 0;

    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/v1/vehicle/getVehicleStepsByCompany', this.GetVehicle, {headers: this.getHeaders() })
          .subscribe((response: any) => {
            this.onPhasesChange.next(response);
            resolve(response);
          }, reject);
    });
  }




  getInspectionTypes(): Promise<any>
  {

    this.InspectionTypes.companyID = this.usersService.getSession('companyInfo').id;
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/v1/inspection/getinspectionType', this.InspectionTypes, {headers: this.getHeaders() })
          .subscribe((response: any) => {
            this.onInspectionTypeChange.next(response);
            resolve(response);
          }, reject);
    });
  }


    getQuestionTypes(): Promise<any>
    {

        this.InspectionTypes.companyID = this.usersService.getSession('companyInfo').id;
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/inspection/getInspectionMultipointQuestionType', this.InspectionTypes, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onQuestionTypeChange.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getActiveInspection(vehicleID): Promise<any>
    {
        this.InspectionTypes.vehicleID = vehicleID;
        this.InspectionTypes.companyID = this.usersService.getSession('companyInfo').id;
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/inspection/getInspection', this.InspectionTypes, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onActiveInspectionChange.next(response);
                    resolve(response);
                }, reject);
        });
    }


  getDocumentTypes(): Promise<any>
  {

    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/api/v1/document/getDocumentType', this.GetVehicle, {headers: this.getHeaders() })
          .subscribe((response: any) => {
            this.onDocTypeChange.next(response);
            resolve(response);
          }, reject);
    });
  }

  getInspectionSubletPortal(payload): Promise<any>
  {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/inspection/getSubletPortalLineItems' , payload, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
  }

  getCompanyVendors(payload): Promise<any>
  {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + '/api/v1/cmp/getCompanyVendor' , payload, {headers: this.getHeaders() })
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
  }

  showToast(message): void{
    this.snackBar.open(message, 'X', {
      duration: 3000,
        verticalPosition: 'top'

    });
  }
}

@Injectable()
export class VehicleResolve implements Resolve<any>
{

  constructor(private vehicleService: VehicleService)
  {}

  resolve(route: ActivatedRouteSnapshot): Promise<any>
  {
    return this.vehicleService.getVehicle(route.paramMap.get('vehicleID'));
  }


}


@Injectable()
export class PhasesResolve implements Resolve<any>
{

  constructor(private vehicleService: VehicleService)
  {}

  resolve(): Promise<any>
  {
    return this.vehicleService.getVehicleVehiclePhases();
  }


}


@Injectable()
export class DocumentTypeResolve implements Resolve<any>
{

  constructor(private vehicleService: VehicleService)
  {}

  resolve(): Promise<any>
  {
    return this.vehicleService.getDocumentTypes();
  }


}

@Injectable()
export class StatsResolve implements Resolve<any>
{

    constructor(private vehicleService: VehicleService)
    {}

    resolve(): Promise<any>
    {
        return this.vehicleService.getDashboardStats();
    }


}


@Injectable()
export class InspectionTypeResolve implements Resolve<any>
{

  constructor(private vehicleService: VehicleService)
  {}

  resolve(): Promise<any>
  {
    return this.vehicleService.getInspectionTypes();
  }


}

@Injectable()
export class QuestionTypeResolve implements Resolve<any>
{

    constructor(private vehicleService: VehicleService)
    {}

    resolve(): Promise<any>
    {
        return this.vehicleService.getQuestionTypes();
    }


}



@Injectable()
export class ActiveInspection implements Resolve<any>
{

    constructor(private vehicleService: VehicleService)
    {}


    resolve(route: ActivatedRouteSnapshot): Promise<any>
    {
        return this.vehicleService.getActiveInspection(route.paramMap.get('vehicleID'));
    }



}





