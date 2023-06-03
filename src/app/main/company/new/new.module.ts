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

import { NewComponent } from 'app/main/company/new/new.component';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { ViewCompanyComponent } from './view-company/view-company.component';

const routes: Routes = [
  {
      path     : 'new',
      component: NewComponent,
      canActivate: [AuthGuardService],
      
  }
];

@NgModule({
  declarations: [
    NewComponent,
    ViewCompanyComponent
  ],
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
entryComponents: [ViewCompanyComponent]
})
export class NewModule { }
