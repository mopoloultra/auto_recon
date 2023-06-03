// import { NgModule } from '@angular/core';
// import { RouterModule } from '@angular/router';

// import { FuseSharedModule } from '@fuse/shared.module';
// import { ProfileComponent } from './profile/profile.component';
// import {MatProgressBarModule} from '@angular/material/progress-bar';
// import {
//     MatSidenavModule,
//     MatDialogModule,
//     MatButtonModule,
//     MatStepperModule,
//     MatCardModule,
//     MatIconModule,
//     MatFormFieldModule,
//     MatSelectModule,
//     MatToolbarModule,
//     MatInputModule,
//     MatTooltipModule,
//     MatMenuModule,
//     MatTabsModule,
//     MatListModule,
//     MatBadgeModule,
//     MatButtonToggleModule,
//     MatDividerModule
// } from '@angular/material';
// import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
// import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
// import { VehiclesComponent } from './vehicles/vehicles.component';
// import { LayoutComponent } from './company-settings/layout/layout.component';

// const routes = [
//     // {
//     //     path        : 'dashboards/analytics',
//     //     loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
//     // },
//     {
//         path        : 'dashboard',
//         loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
//     },
//     {
//         path        : 'mail',
//         loadChildren: './mail/mail.module#MailModule'
//     },
//     {
//         path        : 'mail-ngrx',
//         loadChildren: './mail-ngrx/mail.module#MailNgrxModule'
//     },
//     {
//         path        : 'chat',
//         loadChildren: './chat/chat.module#ChatModule'
//     },
//     {
//         path        : 'calendar',
//         loadChildren: './calendar/calendar.module#CalendarModule'
//     },
//     {
//         path        : 'e-commerce',
//         loadChildren: './e-commerce/e-commerce.module#EcommerceModule'
//     },
//     {
//         path        : 'academy',
//         loadChildren: './academy/academy.module#AcademyModule'
//     },
//     {
//         path        : 'todo',
//         loadChildren: './todo/todo.module#TodoModule'
//     },
//     {
//         path        : 'file-manager',
//         loadChildren: './file-manager/file-manager.module#FileManagerModule'
//     },
//     {
//         path        : 'contacts',
//         loadChildren: './contacts/contacts.module#ContactsModule'
//     },
//     {
//         path        : 'scrumboard',
//         loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
//     },
//     {
//         path        : 'vehicles',
//         component: VehiclesComponent
//     }, 
//     {
//         path        : 'profile',
//         component: ProfileComponent
//     },
//     {
//         path: '',
//         component: LayoutComponent,
//         children: [
//             {
//                 path: 'settings',
//                 loadChildren: () => import('./company-settings/settings/settings.module').then(m => m.SettingsModule)
//             }
//         ]
//     }
// ];

// @NgModule({

//     imports: [
//         RouterModule.forChild(routes),
//         FuseSharedModule,
//         MatSidenavModule,
//         MatDialogModule,
//         MatStepperModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatToolbarModule,
//         MatInputModule,
//         MatCardModule,
//         MatIconModule,
//         MatTooltipModule,
//         MatButtonModule,
//         FuseWidgetModule,
//         MatMenuModule,
//         FuseWidgetModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         FuseSidebarModule,
//         MatTabsModule,
//         MatListModule,
//         MatBadgeModule,
//         MatButtonToggleModule,
//         MatProgressBarModule,
//         MatDividerModule


//     ],
//     declarations: [ProfileComponent, ProfileEditComponent, VehiclesComponent, LayoutComponent],
//     entryComponents: [ProfileEditComponent]
// })
// export class AppsModule
// {
// }


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { ProfileComponent } from './profile/profile.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {
    MatSidenavModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    MatListModule,
    MatBadgeModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatExpansionModule, MatDatepickerModule, MatChipsModule, MatAutocompleteModule,
} from '@angular/material';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { FuseWidgetModule, FuseSidebarModule } from '@fuse/components';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { LayoutComponent } from './company-settings/layout/layout.component';
import {ViewVehicleComponent} from './vehicles/view-vehicle/view-vehicle.component';
import {ChartsModule} from 'ng2-charts';
import {VehicleInspectionComponent} from './vehicles/vehicle-inspection/vehicle-inspection.component';
import {VehicleOverviewComponent} from './vehicles/vehicle-overview/vehicle-overview.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {VehicleResolve} from '../../services/vehicle.service';
import {PhasesResolve} from '../../services/vehicle.service';
import { PhaseConfirmationDialogComponent } from './vehicles/dialogs/phase-confirmation-dialog/phase-confirmation-dialog.component';
import { PhaseUpdateComponent } from './vehicles/dialogs/phase-update/phase-update.component';
import { DocumentTypeResolve} from '../../services/vehicle.service';
import { UploadDocumentDialogComponent } from './vehicles/dialogs/upload-document-dialog/upload-document-dialog.component';
import {InspectionTypeResolve} from '../../services/vehicle.service';
import { PhasesPipe } from './vehicles/pipes/phases.pipe';
import { VehicleStepperComponent } from './vehicles/vehicle-stepper/vehicle-stepper.component';
import { VehicleViewDocumentsDialogComponent } from './vehicles/dialogs/vehicle-view-documents-dialog/vehicle-view-documents-dialog.component';
import { CreateConfirmationComponent } from './vehicles/dialogs/create-confirmation/create-confirmation.component';
import { MultipointUploadDialogComponent } from './vehicles/dialogs/multipoint-upload-dialog/multipoint-upload-dialog.component';
import { ProcessingDialogComponent } from './vehicles/dialogs/processing-dialog/processing-dialog.component';
import { NotesDialogComponent } from './vehicles/dialogs/notes-dialog/notes-dialog.component';
import {QuestionTypeResolve} from '../../services/vehicle.service';
import {ActiveInspection} from '../../services/vehicle.service';
import { DocumentViewComponent } from './vehicles/dialogs/document-view/document-view.component';
import {StatsResolve} from '../../services/vehicle.service';
import { HotlistComponent } from './hotlist/hotlist.component';
import { TasksComponent } from './tasks/tasks.component';
import { VehicleRecentActivityComponent } from './vehicles/vehicle-recent-activity/vehicle-recent-activity.component';
import { ActivitiesDialogComponent } from './vehicles/dialogs/activities-dialog/activities-dialog.component';
import { VehicleNotesComponent } from './vehicles/vehicle-notes/vehicle-notes.component';
import { VehicleTasksComponent } from './vehicles/vehicle-tasks/vehicle-tasks.component';
import { AddTaskComponent } from './vehicles/dialogs/add-task/add-task.component';
import { ViewDialogComponent } from './vehicles/vehicle-tasks/view-dialog/view-dialog.component';
import { InspectionSubletPortalComponent } from './vehicles/inspection-sublet-portal/inspection-sublet-portal.component';


const routes = [
    // {
    //     path        : 'dashboards/analytics',
    //     loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
    // },
    {
        path        : 'dashboard',
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    },
    {
        path        : 'mail',
        loadChildren: './mail/mail.module#MailModule'
    },
    {
        path        : 'mail-ngrx',
        loadChildren: './mail-ngrx/mail.module#MailNgrxModule'
    },
    {
        path        : 'chat',
        loadChildren: './chat/chat.module#ChatModule'
    },
    {
        path        : 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
    {
        path        : 'e-commerce',
        loadChildren: './e-commerce/e-commerce.module#EcommerceModule'
    },
    {
        path        : 'academy',
        loadChildren: './academy/academy.module#AcademyModule'
    },
    {
        path        : 'todo',
        loadChildren: './todo/todo.module#TodoModule'
    },
    {
        path        : 'file-manager',
        loadChildren: './file-manager/file-manager.module#FileManagerModule'
    },
    {
        path        : 'contacts',
        loadChildren: './contacts/contacts.module#ContactsModule'
    },
    {
        path        : 'scrumboard',
        loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
    },

    {
        path        : 'vehicles',
        component: VehiclesComponent,
        resolve  : {
            phases: PhasesResolve,
            stats: StatsResolve
        }
    },
    {
        path        : 'profile',
        component: ProfileComponent
    },
    {
        path        : 'vehicle-view/:vehicleID',
        component: ViewVehicleComponent,
        resolve  : {
            vehicle: VehicleResolve,
            documentTypes: DocumentTypeResolve,
            inspectionTypes: InspectionTypeResolve,
            phases: PhasesResolve,
            questionTypes: QuestionTypeResolve,
            activeInspection: ActiveInspection
        }
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'settings',
                loadChildren: () => import('./company-settings/settings/settings.module').then(m => m.SettingsModule)
            }
        ]
    }
];

@NgModule({

    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        MatSidenavModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatSelectModule,
        MatToolbarModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        FuseWidgetModule,
        MatMenuModule,
        FuseWidgetModule,
        MatFormFieldModule,
        MatSelectModule,
        FuseSidebarModule,
        MatTabsModule,
        MatListModule,
        MatListModule,
        MatBadgeModule,
        MatButtonToggleModule,
        MatProgressBarModule,
        MatDividerModule,
        ChartsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        Ng2SearchPipeModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    // declarations: [ProfileComponent, ProfileEditComponent, VehiclesComponent, LayoutComponent],

    declarations: [ProfileComponent, ProfileEditComponent, VehiclesComponent, LayoutComponent, ViewVehicleComponent, VehicleInspectionComponent, VehicleOverviewComponent, PhaseConfirmationDialogComponent, PhaseUpdateComponent, UploadDocumentDialogComponent, PhasesPipe, VehicleStepperComponent, VehicleViewDocumentsDialogComponent, CreateConfirmationComponent, MultipointUploadDialogComponent, ProcessingDialogComponent, NotesDialogComponent, DocumentViewComponent, HotlistComponent, TasksComponent, VehicleRecentActivityComponent, ActivitiesDialogComponent, VehicleNotesComponent, VehicleTasksComponent, AddTaskComponent, ViewDialogComponent, InspectionSubletPortalComponent],
    entryComponents: [ProfileEditComponent, PhaseConfirmationDialogComponent, PhaseUpdateComponent, UploadDocumentDialogComponent, VehicleViewDocumentsDialogComponent, CreateConfirmationComponent, MultipointUploadDialogComponent, ProcessingDialogComponent, NotesDialogComponent, DocumentViewComponent, ActivitiesDialogComponent, AddTaskComponent, ViewDialogComponent],
    exports: [
        HotlistComponent,
        VehicleTasksComponent
    ],
    providers: [VehicleResolve, PhasesResolve, DocumentTypeResolve, InspectionTypeResolve, QuestionTypeResolve, ActiveInspection, StatsResolve]
})
export class AppsModule
{
}

