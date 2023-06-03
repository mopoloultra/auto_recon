import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material'  
import { MatPaginatorModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { ErrorLogsComponent } from './error-logs.component';

const routes: Routes = [
  {
      path     : 'logs',
      component: ErrorLogsComponent
  }
];

@NgModule({
  declarations: [ErrorLogsComponent],
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
    FuseSharedModule
  ]
})
export class ErrorLogsModule { }
