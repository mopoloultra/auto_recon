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
    MatProgressSpinner,
    MatProgressSpinnerModule,
    MatSortModule
} from '@angular/material'
import { MatPaginatorModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { RolesComponent } from 'app/main/company/roles/roles.component';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { EditCompanyRoleComponent } from './edit-company-role/edit-company-role.component';


const routes: Routes = [
  {
      path     : 'roles',
      component: RolesComponent,
      canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [RolesComponent, EditCompanyRoleComponent],
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
        FuseSharedModule,
        MatSortModule
    ],
  entryComponents: [EditCompanyRoleComponent]
})
export class RolesModule { }
