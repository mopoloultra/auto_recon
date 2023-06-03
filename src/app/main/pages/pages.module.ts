import { NgModule } from '@angular/core';
import { LockModule } from 'app/main/pages/authentication/lock/lock.module';
import { MailConfirmModule } from 'app/main/pages/authentication/mail-confirm/mail-confirm.module';
import { ComingSoonModule } from 'app/main/pages/coming-soon/coming-soon.module';
import { Error404Module } from 'app/main/pages/errors/404/error-404.module';
import { Error500Module } from 'app/main/pages/errors/500/error-500.module';
import { InvoiceModernModule } from 'app/main/pages/invoices/modern/modern.module';
import { InvoiceCompactModule } from 'app/main/pages/invoices/compact/compact.module';
import { MaintenanceModule } from 'app/main/pages/maintenance/maintenence.module';
import { PricingModule } from 'app/main/pages/pricing/pricing.module';
import { ProfileModule } from 'app/main/pages/profile/profile.module';
import { SearchClassicModule } from 'app/main/pages/search/classic/search-classic.module';
import { SearchModernModule } from 'app/main/pages/search/modern/search-modern.module';
import { FaqModule } from 'app/main/pages/faq/faq.module';
import { KnowledgeBaseModule } from 'app/main/pages/knowledge-base/knowledge-base.module';
import { LoginModule } from './authentication/login/login.module';
import { RegisterModule } from './authentication/register/register.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,
        RegisterModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        LockModule,
        MailConfirmModule,

        // Coming-soon
        ComingSoonModule,

        // Errors
        Error404Module,
        Error500Module,

        // Invoices
        InvoiceModernModule,
        InvoiceCompactModule,

        // Maintenance
        MaintenanceModule,

        // Pricing
        PricingModule,

        // Profile
        ProfileModule,

        // Search
        SearchClassicModule,
        SearchModernModule,

        // Faq
        FaqModule,

        // Knowledge base
        KnowledgeBaseModule
    ]
})
export class PagesModule
{

}
