import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Router } from '@angular/router';
import { reset } from 'app/main/models/auth/reset/reset';
import { hostHeaderInfo } from 'app/main/models/hostHeaderInfo';
import { AuthService } from 'app/services/auth.service';

import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material';
import {SuccessDialogComponent} from './success-dialog/success-dialog.component';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit, OnDestroy
{
    forgotPasswordForm: FormGroup;
    formData: reset;
    hostHeaderInfo: hostHeaderInfo;
    infoText: any;
    showSpinner:boolean;
    /**
     * Constructor
     *
     @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param authService
     * @param dialog
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        public authService: AuthService,
        public dialog: MatDialog
    )
    {
        this.showSpinner = false;
        this.infoText = '';
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

        this.formData = new reset();
        this.hostHeaderInfo = new hostHeaderInfo();
        this.formData.hostHeaderInfo = new hostHeaderInfo();
    }

    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: [this.formData.email, [Validators.required, Validators.email]]
        });
    }

    ngOnDestroy(): void{
        this.showSpinner = false;
    }

    resetPwd(form): any{
        this.showSpinner = true;
        this.formData.email = form.value.email;

        console.log(JSON.stringify(form.value));
        
        if (form.value.email !== '') {
            this.authService.resetAccount(this.forgotPasswordForm.get('email').value).subscribe((data) => {
                if (data.hostHeaderInfo.responseCode === '000'){
                    this.showSpinner = false;
                    this.dialog.open( SuccessDialogComponent, {
                        disableClose: true
                    });
                   
                }else{
                //    this.router.navigate(['/reset-password']);
                    this.authService.showToast(data.hostHeaderInfo.responseMessage);
                    this.showSpinner = false;

                }

            }, err => {
                this.authService.showToast('Please try again later');
                this.showSpinner = false;
                console.log(err);
                                
            });

        } else {
            
        }
    }
}
