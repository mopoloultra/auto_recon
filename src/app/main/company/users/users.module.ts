import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    MatSortModule
} from '@angular/material'
import { MatPaginatorModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { UsersComponent } from 'app/main/company/users/users.component';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { CompanyUserViewComponent } from './company-user-view/company-user-view.component';

const routes: Routes = [
  {
      path     : 'users',
      component: UsersComponent,
      canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [UsersComponent, CompanyUserViewComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDialogModule,
        FuseSharedModule,
        MatSortModule
    ],
  entryComponents: [CompanyUserViewComponent]
})
export class UsersModule { }
