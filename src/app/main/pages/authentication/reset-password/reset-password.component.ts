import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Router } from '@angular/router';
import { setPwd } from 'app/main/models/auth/set-pwd/set-pwd';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import {AuthService} from '../../../../services/auth.service';
import {MatDialog} from '@angular/material';
import {SuccessDialogComponent} from './success-dialog/success-dialog.component';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class ResetPasswordComponent implements OnInit, OnDestroy
{
    resetPasswordForm: FormGroup;
    formData: setPwd;
    hostHeaderInfo: hostHeaderInfo;

    // Private
    private _unsubscribeAll: Subject<any>;
    private _unsubscribeUserVerification: Subject<any>;
    userData: any;
    showSpinner: boolean = false;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        public dialog: MatDialog
    )
    {
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
        this.formData = new setPwd();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.formData.hostHeaderInfo = new hostHeaderInfo();
        this._unsubscribeUserVerification = new Subject();
    }

    ngOnInit(): void
    {
        this.authService.onPasswordVerifyChange
            .pipe(takeUntil(this._unsubscribeUserVerification))
            .subscribe(resp => {
                if (resp.hostHeaderInfo.responseCode === '000'){
                    this.userData = resp.info;

                }else{
                    this.router.navigate(['/login']);

                }

            });

        this.resetPasswordForm = this._formBuilder.group({
            password       : [this.formData.password, Validators.required],
            passwordConfirm: [this.formData.confimrPwd, [Validators.required, confirmPasswordValidator]]
        });


        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
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

    resetPwd(){

        this.showSpinner = true;
        this.formData.userID = this.userData.id;

        this.authService.changePassword(this.formData).subscribe(data => {
            if(data.hostHeaderInfo.responseCode === '000'){
                this.showSpinner = false;
                this.dialog.open( SuccessDialogComponent, {
                    disableClose: true
                });

            }else{
                this.showSpinner = false;
                this.authService.showToast(data.hostHeaderInfo.responseMessage);
            }

        },error => {
            this.showSpinner = false;
            this.authService.showToast('Please try again later');
        });

        console.log(JSON.stringify(this.formData));
        /* if successful navigate back to login */
        // this.router.navigate(['/']);
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
