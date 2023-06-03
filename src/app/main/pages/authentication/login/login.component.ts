import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { hostHeaderInfo } from '../../../models/hostHeaderInfo';
import { login } from '../../../models/auth/login/login';

import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import {StorageService} from './storage.service';

import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy
{
    loginForm: FormGroup;

    formData: login;
    hostHeaderInfo: hostHeaderInfo;
    loginInfo: any = '';
    showInfo: boolean = false;
    showSpinner: boolean = false;
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param authService
     * @param storageService
     */
    constructor(
        private _fuseConfigService: FuseConfigService, 
        private _formBuilder: FormBuilder, 
        private router: Router,
        public authService: AuthService,
        public storageService: StorageService
        )
    {
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

        this.formData = new login();
        this.hostHeaderInfo = new hostHeaderInfo();
       // this.formData.hostHeaderInfo = new hostHeaderInfo();
    }


    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnDestroy(): void{
        this.showSpinner = false;
        this.loginForm.reset();
    }

    login(form: NgForm): void{
         this.showSpinner = true;
         const sunmitData = {

            hostHeaderInfo: {
            channel: this.hostHeaderInfo.channel,
            sourceCode: this.hostHeaderInfo.sourceCode

        },
        email: form.value.email,
        password: form.value.password,
             ipAddress: this.authService.getIp()

        };
       
         console.log(JSON.stringify(sunmitData));


         this.authService.loginUser(sunmitData).subscribe((data: any) => {
            console.log('login response ');
            console.log(data);

            if (data.hostHeaderInfo.responseCode === '000') {
                sessionStorage.setItem('userToken', JSON.stringify(data.hostHeaderInfo.token));
                this.storageService.setItem('userDetails', JSON.stringify(data.profileInfo));
               // sessionStorage.setItem('userDetails', JSON.stringify(data.profileInfo));
                sessionStorage.setItem('companyInfo', JSON.stringify(data.companyInfo));
                sessionStorage.setItem('userCompanies', JSON.stringify(data.userCompanies));
                sessionStorage.setItem('permissions', JSON.stringify(data.userCompanies[0].permissions));
                this.router.navigate(['/apps/dashboard']).then(() => {
                    this.showSpinner = false;
                });
            } else {
                this.showSpinner = false;

                this.authService.showToast(data.hostHeaderInfo.responseMessage);

            }

        }, err => {
            console.log('login error', err);
            this.authService.showToast('Login Error, Check Connection and Try Again');
            this.showSpinner = false;


        });
    }
}
