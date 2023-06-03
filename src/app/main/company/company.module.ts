import { NgModule } from '@angular/core';
import { NewModule } from './new/new.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';



@NgModule({
  declarations: [],
  imports: [
    NewModule,
    RolesModule,
    UsersModule
  ]
})
export class CompanyModule { }
