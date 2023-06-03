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
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSortModule
} from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { AllUsersComponent } from 'app/main/admin/all-users/all-users.component';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { ViewUserComponent } from './view-user/view-user.component';
import { RoleGuardService } from 'app/services/role-guard.service';

const routes: Routes = [
  {
      path     : 'users',
      component: AllUsersComponent,
      canActivate: [AuthGuardService],
     // data: {role: 'Admin'}
  }
];

@NgModule({
  declarations: [AllUsersComponent, ViewUserComponent],
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
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        FuseSharedModule,
        MatSortModule
    ],
  entryComponents: [ViewUserComponent],
 // providers: [AuthGuardService, RoleGuardService]
})
export class AllUsersModule { }
