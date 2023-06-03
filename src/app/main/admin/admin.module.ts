import { NgModule } from '@angular/core';

import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AllUsersModule } from './all-users/all-users.module';


@NgModule({
  declarations: [],
  imports: [
    RolesModule,
    UsersModule,
    AllUsersModule
  ]
})
export class AdminModule { }
