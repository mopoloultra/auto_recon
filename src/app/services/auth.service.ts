import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {environment} from 'environments/environment';
import {map, catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    url: any = '';
    headers: any;
    onUserVerifyChange: BehaviorSubject<any>;
    onPasswordVerifyChange: BehaviorSubject<any>;
    ipAddress: any;


    constructor(public http: HttpClient, private snackBar: MatSnackBar) {
        this.url = environment.url;
        this.headers = new HttpHeaders();
        this.headers.set('Content-Type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );

        this.onUserVerifyChange = new BehaviorSubject([]);
        this.onPasswordVerifyChange = new BehaviorSubject([]);



    }

    getIp(): any{
        this.http.get<{ip:string}>('https://jsonip.com')
            .subscribe( data => {
                this.ipAddress = data;

            });
    }

    loginUser(userDetails): Observable<any> {
        return this.http.post<any>(this.url + 'api/v1/login', userDetails, {headers: this.headers})
            .pipe(map(data => data),
                catchError(err => {
                    console.log('login service err', err);
                    return throwError(err);
                }));

    }


    changePassword(userDetails): Observable<any> {
        return this.http.post<any>(this.url + 'api/v1/changeUserPassword', userDetails, {headers: this.headers})
            .pipe(map(data => data),
                catchError(err => {
                    console.log('login service err', err);
                    return throwError(err);
                }));

    }


    validateUserRegister(userDetails): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + '/api/v1/getInviteInfo?uuid=' + userDetails, {headers: this.headers})
                .subscribe((response: any) => {
                    this.onUserVerifyChange.next(response);
                    resolve(response);
                }, reject);
        });


    }

    validateUserReset(userDetails): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + '/api/v1/getUserPasswordResetInfo?uuid=' + userDetails, {headers: this.headers})
                .subscribe((response: any) => {
                    this.onPasswordVerifyChange.next(response);
                    resolve(response);
                }, reject);
        });


    }

    resetAccount(userEmail): Observable<any> {
        return this.http.get<any>(this.url + 'api/v1/resetPassword?email=' + userEmail, {headers: this.headers}).pipe(
            catchError(err => {
                console.log('reset Acc error', err);
                return throwError(err);
            })
        );

    }

    showToast(message): void {
        this.snackBar.open(message, 'Info', {
            duration: 3000,

        });
    }
}

@Injectable()
export class ValidateRegister implements Resolve<any>
{

    constructor(private authService: AuthService)
    {}


    resolve(route: ActivatedRouteSnapshot): Promise<any>
    {
        return this.authService.validateUserRegister(route.paramMap.get('uuid'));
    }



}

@Injectable()
export class ValidateReset implements Resolve<any>
{

    constructor(private authService: AuthService)
    {}


    resolve(route: ActivatedRouteSnapshot): Promise<any>
    {
        return this.authService.validateUserReset(route.paramMap.get('uuid'));
    }



}
