import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { BillingComponent } from './billing/billing.component';
import { UsersComponent } from './users/users.component';
import { FormsComponent } from './forms/forms.component';
import { PaymentsComponent } from './payments/payments.component';
import { RolesComponent } from './roles/roles.component';
import { InviteComponent } from './invite/invite.component';
import { ViewAllComponent } from './view-all/view-all.component';
import { CompaniesComponent } from './companies/companies.component';
import { ErrorLogsComponent } from './error-logs/error-logs.component';
import { CompanyRolesComponent } from './company-roles/company-roles.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { TagsComponent } from './tags/tags.component';
import {CompanyInfoResolve} from '../settings.service';
import {CompanyDataResolve} from '../settings.service';
import {QuotesComponent} from './quotes/quotes.component';
import {AnnouncementComponent} from './announcement/announcement.component';
import {QuestionsComponent} from './questions/questions.component';
import {VendorsComponent} from './vendors/vendors.component';
import { VendorUsersComponent } from './vendor-users/vendor-users.component';


const routes: Routes = [
  {
    path        : 'general',
    component: GeneralComponent,
    resolve: {
      CompanyInfo: CompanyInfoResolve,
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'billing',
    component: BillingComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'users',
    component: UsersComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'tags',
        component: TagsComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'forms',
    component: FormsComponent
  },
  {
    path        : 'payments',
    component: PaymentsComponent
  },
  {
    path        : 'view-all',
    component: ViewAllComponent
  },
  {
    path        : 'roles',
    component: RolesComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'invite',
    component: InviteComponent
  },
  {
    path        : 'companies',
    component: CompaniesComponent
  },
  {
    path        : 'error-logs',
    component: ErrorLogsComponent
  },
  {
    path        : 'company-roles',
    component: CompanyRolesComponent
  },
  {
    path        : 'company-users',
    component: CompanyUsersComponent
  },

  {
    path        : 'questions',
    component: QuestionsComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },

  {
    path        : 'vendor',
    component: VendorsComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },

  {
    path        : 'vendor/:vendorId',
    component: VendorUsersComponent
  },

  {
    path        : 'quotes',
    component: QuotesComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  },
  {
    path        : 'announcement',
    component: AnnouncementComponent,
    resolve: {
      companies: CompanyDataResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CompanyInfoResolve, CompanyDataResolve],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
