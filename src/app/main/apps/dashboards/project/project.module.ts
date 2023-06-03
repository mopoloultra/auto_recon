import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatListModule } from '@angular/material/list';
import {MatTableModule, MatSortModule, MatProgressBarModule, MatProgressSpinnerModule} from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { ProjectDashboardComponent } from 'app/main/apps/dashboards/project/project.component';
import { ProjectDashboardService } from 'app/main/apps/dashboards/project/project.service';
import { AuthGuardService } from 'app/services/auth-guard.service';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import { HotlistComponent } from './hotlist/hotlist.component';
import { TasksComponent } from './tasks/tasks.component';
import { ActivitiesComponent } from './activities/activities.component';



const routes: Routes = [
    {
        path     : '**',
        component: ProjectDashboardComponent,
        resolve  : {
            data: ProjectDashboardService
        },
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    declarations: [
        ProjectDashboardComponent,
        HotlistComponent,
        TasksComponent,
        ActivitiesComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        MatListModule,
        MatCheckboxModule,

        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatButtonToggleModule,
        SatDatepickerModule,
        SatNativeDateModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        MatBadgeModule,
        MatProgressSpinnerModule,

    ],
    providers   : [
        ProjectDashboardService
    ]
})
export class ProjectDashboardModule
{
}

