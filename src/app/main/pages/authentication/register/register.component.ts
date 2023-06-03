import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { register } from 'app/main/models/auth/register/register';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { Router } from '@angular/router';
import { UsersService } from 'app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthService} from '../../../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{

    companyName = 'KyleAuto Works';
    registerForm: FormGroup;
    formData: register;
    hostHeaderInfo: hostHeaderInfo;

    private _unsubscribeUserVerification: Subject<any>;
    isVerified = false;
    userResp: any;
    loading = false;


    // Vertical Stepper
    verticalStepperStep1: FormGroup;
    verticalStepperStep2: FormGroup;
    verticalStepperStep3: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param userService
     * @param authService
     * @param route
     * @param dialog
     */

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        public userService: UsersService,
        public authService: AuthService,
        public route: ActivatedRoute,
        public dialog: MatDialog
    )
    {
        this.hostHeaderInfo = new hostHeaderInfo();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._unsubscribeUserVerification = new Subject();

        this.formData = new register();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.formData.hostHeaderInfo = new hostHeaderInfo();
    }

    ngOnInit(): void
    {

        this.route.params.subscribe(params => {
            this.userResp = params['uuid'];
        });

        this.authService.onUserVerifyChange
            .pipe(takeUntil(this._unsubscribeUserVerification))
            .subscribe(resp => {
                if (resp.hostHeaderInfo.responseCode === '000'){
                    this.isVerified = true;
                }else{
                    this.router.navigate(['/login']);
                    this.isVerified = false;
                }

            });

        // Vertical Stepper form stepper
        this.verticalStepperStep1 = this._formBuilder.group({
            address: ['', Validators.required],
            address1: ['']
        });

        this.verticalStepperStep2 = this._formBuilder.group({
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });

        this.verticalStepperStep3 = this._formBuilder.group({
            password       : ['', [Validators.required, Validators.minLength(6)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    finishVerticalStepper(): void
    {
        console.log(JSON.stringify(this.formData));
        this.router.navigate(['/']);
    }

    getFirstStepperData(form: FormGroup){
        this.formData.address = form.get('address').value;
        this.formData.address1 = form.get('address1').value;
    }

    getSecondStepperData(form: FormGroup){
        this.formData.city = form.get('city').value;
        this.formData.state = form.get('state').value;
        this.formData.postalCode = form.get('postalCode').value;
    }

    getThirdStepperData(form: FormGroup){
        this.formData.password = form.get('password').value;
        this.formData.confirmPassword = form.get('passwordConfirm').value;

    }
    
    completeSignUp(): void {
        this.loading = true;
     const regiserData =   {
            hostHeaderInfo:{
                channel: this.hostHeaderInfo.channel,
                sourceCode: this.hostHeaderInfo.sourceCode,
                token: this.userService.getSession('userToken')
            },
             id: this.userResp,
            address: this.formData.address,
            address2: this.formData.address1,
            city: this.formData.city,
            state: this.formData.state,
            zip: this.formData.postalCode,
            password: this.formData.password,
            confirmPassword: this.formData.confirmPassword,
               
        };

     this.userService.completeSignUp(regiserData).subscribe((data: any) => {
                if (data.responseCode === '000') {
                    this.dialog.open( UnauthorizedComponent, {
                        disableClose: true
                    });

                    this.userService.showToast(data.responseMessage);
                    this.verticalStepperStep1.reset();
                    this.verticalStepperStep2.reset();
                    this.verticalStepperStep3.reset();
                    setTimeout(() => {                        
                        this.router.navigate(['/login']);
                    }, 2000);

                } else {
                    this.loading = false;
                    this.userService.showToast(data.responseMessage);               
                }
        }, (err: HttpErrorResponse) => {
         this.loading = false;
            console.log('complete signup error', err);            
        });
    }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
