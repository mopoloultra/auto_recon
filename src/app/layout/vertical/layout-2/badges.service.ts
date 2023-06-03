import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import {GetVehicle} from '../../../main/models/vehicles/GetVehicle';
import {hostHeaderInfo} from '../../../main/models/hostHeaderInfo';
import {UsersService} from '../../../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {

  url: any = '';
  headers: any;


  public hostHeaderInfo: hostHeaderInfo;
  public GetVehicle: GetVehicle;

  constructor() { }
}
