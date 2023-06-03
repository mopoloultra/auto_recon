import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent } from 'app/main/pages/authentication/register/register.component';
import {ValidateRegister} from '../../../../services/auth.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import {MatProgressSpinnerModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';


const routes = [
    {
        path     : 'register/:uuid',
        component: RegisterComponent,
        resolve  : {
            userData: ValidateRegister
        }
    }
];






@NgModule({
    declarations: [
        RegisterComponent,
        UnauthorizedComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatStepperModule,

        FuseSharedModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    providers: [ValidateRegister],
    entryComponents: [UnauthorizedComponent]
})
export class RegisterModule
{
}
