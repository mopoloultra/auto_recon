import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ResetPasswordComponent } from 'app/main/pages/authentication/reset-password/reset-password.component';
import {ValidateReset} from '../../../../services/auth.service';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

const routes = [
    {
        path     : 'setPassword/:uuid',
        component: ResetPasswordComponent,
        resolve: {
            userData: ValidateReset
        }
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent,
        SuccessDialogComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,
        MatDialogModule
    ],
    entryComponents: [SuccessDialogComponent],
    providers: [ValidateReset]
})
export class ResetPasswordModule
{
}
