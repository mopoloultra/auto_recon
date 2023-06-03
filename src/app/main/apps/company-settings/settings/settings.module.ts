import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {GeneralComponent} from './general/general.component';
import {BillingComponent} from './billing/billing.component';
import {UsersComponent} from './users/users.component';
import {FormsComponent} from './forms/forms.component';
import {PaymentsComponent} from './payments/payments.component';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule, MatDatepickerModule,
    MatDividerModule,MatTooltipModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule,
    MatSelectModule, MatSortModule, MatTableModule
} from '@angular/material';
import {FlexModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {RolesComponent} from './roles/roles.component';
import {InviteComponent} from './invite/invite.component';
import {ViewAllComponent} from './view-all/view-all.component';
import {CompaniesComponent} from './companies/companies.component';
import {ErrorLogsComponent} from './error-logs/error-logs.component';


import {MatStepperModule} from '@angular/material/stepper';
import {MatPaginatorModule} from '@angular/material';
import {FuseSharedModule} from '@fuse/shared.module';
import {ViewUserComponent} from './dialogs/view-user/view-user.component';


import {
    MatProgressSpinnerModule,
    MatDialogModule,
} from '@angular/material';
import {EditUserComponent} from './dialogs/edit-user/edit-user.component';
import { EditRoleComponent } from './dialogs/edit-role/edit-role.component';
import { ViewCompanyComponent } from './dialogs/view-company/view-company.component';
import { EditCompanyRoleComponent } from './dialogs/edit-company-role/edit-company-role.component';
import { CompanyRolesComponent } from './company-roles/company-roles.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { CompanyUserViewComponent } from './dialogs/company-user-view/company-user-view.component';
import { TagsComponent } from './tags/tags.component';
import { AddTagComponent } from './dialogs/add-tag/add-tag.component';
import { EditTagsComponent } from './dialogs/edit-tags/edit-tags.component';
import { UpdateStepsComponent } from './dialogs/update-steps/update-steps.component';
import { NewStepComponent } from './dialogs/new-step/new-step.component';
import { InviteUserComponent } from './dialogs/invite-user/invite-user.component';
import { PermissionsComponent } from './dialogs/permissions/permissions.component';
import { AddRolesComponent } from './dialogs/add-roles/add-roles.component';
import { AddCompanyComponent } from './dialogs/add-company/add-company.component';
import { QuotesComponent } from './quotes/quotes.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionsDialogComponent } from './dialogs/questions-dialog/questions-dialog.component';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorDialogComponent } from './dialogs/vendor-dialog/vendor-dialog.component';
import { VendorCompanyFilterPipe } from './pipes/vendor-company.pipe';
import { VendorUsersComponent } from './vendor-users/vendor-users.component';


@NgModule({
    declarations: [GeneralComponent, BillingComponent, UsersComponent, FormsComponent, PaymentsComponent, RolesComponent, InviteComponent, ViewAllComponent, CompaniesComponent, ErrorLogsComponent, ViewUserComponent, EditUserComponent, EditRoleComponent, ViewCompanyComponent, EditCompanyRoleComponent, CompanyRolesComponent, CompanyUsersComponent, CompanyUserViewComponent, TagsComponent, AddTagComponent, EditTagsComponent, UpdateStepsComponent, NewStepComponent, InviteUserComponent, PermissionsComponent, AddRolesComponent, AddCompanyComponent, QuotesComponent, AnnouncementComponent, QuestionsComponent, QuestionsDialogComponent, VendorsComponent, VendorDialogComponent, VendorCompanyFilterPipe, VendorUsersComponent],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        MatCardModule,
        FlexModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatStepperModule,
        MatPaginatorModule,
        FuseSharedModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatDatepickerModule,
        MatMenuModule,
        MatTooltipModule,
        MatListModule

    ],
    entryComponents: [ViewUserComponent, EditUserComponent, EditRoleComponent, ViewCompanyComponent, EditCompanyRoleComponent, CompanyUserViewComponent, AddTagComponent, EditTagsComponent, UpdateStepsComponent, NewStepComponent, InviteUserComponent, PermissionsComponent, AddRolesComponent, AddCompanyComponent, QuestionsDialogComponent, VendorDialogComponent]
})
export class SettingsModule {
}
