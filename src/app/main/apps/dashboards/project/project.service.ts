import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { environment } from 'environments/environment';
import {hostHeaderInfo} from '../../../models/hostHeaderInfo';
import {DashboardStats} from '../../../models/dashboard/DashboardStats';
import {UsersService} from '../../../../services/users.service';
import {GetAnnouncment} from '../../../models/settings/GetAnnouncment';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class ProjectDashboardService implements Resolve<any>
{
    projects: any[];
    widgets: any[];
    url: any = '';
    headers: any;
    public hostheaderInfo: hostHeaderInfo;
    public DashboardStats: DashboardStats;
    onStatsChange: BehaviorSubject<any>;
    onAnnouncements: BehaviorSubject<any>;
    onQuotes: BehaviorSubject<any>;
    public GetAnnouncment: GetAnnouncment;
    lon: any;
    empty: Observable<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param usersService
     */
    constructor(
        private _httpClient: HttpClient,
        public usersService: UsersService
    )
    {
        this.url = environment.url;
        this.hostheaderInfo = new hostHeaderInfo();
        this.DashboardStats = new DashboardStats();
        this.DashboardStats.hostHeaderInfo = this.hostheaderInfo;
        this.onStatsChange = new BehaviorSubject([]);
        this.onAnnouncements = new BehaviorSubject([]);
        this.onQuotes = new BehaviorSubject([]);

        this.GetAnnouncment = new GetAnnouncment();
        this.GetAnnouncment.hostHeaderInfo = this.hostheaderInfo;



    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProjects(),
                this.getWidgets(),
                this.getDashboardStats(),
                this.getTodayAnnouncement(),
                this.getTodayQuote()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get projects
     *
     * @returns {Promise<any>}
     */
    getProjects(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/project-dashboard-projects')
                .subscribe((response: any) => {
                    this.projects = response;
                    resolve(response);
                }, reject);
        });
    }


    getLocation(lon,lat): Observable<any>{


                // tslint:disable-next-line:max-line-length
        const url = 'https://community-open-weather-map.p.rapidapi.com/weather?id=2172797&units=imperial&lon=' + lon + '&lat=' + lat;
        return this._httpClient.get<any>(url,
                    { headers: this.getHeadersLocation()})
                    .pipe(map((data: any) => data),
                        catchError (err => {
                            console.log( err);
                            return throwError(err);
                        }));


    }

    getDashboardStats(): Promise<any>
    {

        this.DashboardStats.companyID = this.usersService.getSession('companyInfo').id;
        this.DashboardStats.userID = this.usersService.getSession('userDetails').id;
        this.DashboardStats.vehicleID = 0;

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/vehicle/getVehicleStepsStatsByCompany', this.DashboardStats, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onStatsChange.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getTodayAnnouncement(): Promise<any>
    {

        const DateObj = new Date();
        const  dateString = DateObj.getFullYear() + '-' + ('0' + (DateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + DateObj.getDate()).slice(-2);


        this.GetAnnouncment.companyID = this.usersService.getSession('companyInfo').id;
        this.GetAnnouncment.createdByUserID = 0;
        this.GetAnnouncment.isQuoteOfTheDay = false;
        this.GetAnnouncment.endDate = dateString;
        this.GetAnnouncment.stateDate = dateString;
        this.GetAnnouncment.isAll = false;
        this.GetAnnouncment.id = 0;

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/cmp/getCompanyAnnouncement', this.GetAnnouncment, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onAnnouncements.next(response);
                    resolve(response);
                }, reject);
        });
    }


    getTodayQuote(): Promise<any>
    {

        this.GetAnnouncment.companyID = this.usersService.getSession('companyInfo').id;


        return new Promise((resolve, reject) => {
            this._httpClient.post(this.url + '/api/v1/cmp/getQuoteOfTheDay', this.GetAnnouncment, {headers: this.getHeaders() })
                .subscribe((response: any) => {
                    this.onQuotes.next(response);
                    resolve(response);
                }, reject);
        });
    }



    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/project-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }

    getHeaders(): HttpHeaders{
        const headers = new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Swift ' + this.getSession('userToken'),
        });

        return headers;
    }

    getHeadersLocation(): HttpHeaders{
        const headers = new HttpHeaders({
            'x-rapidapi-key':  '0bba862fc4msh58ff794b966c279p108cb7jsnbd852089093c',
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
            'Content-Type':  'text/html',
            'Accept': 'text/html'
        });

        return headers;
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
