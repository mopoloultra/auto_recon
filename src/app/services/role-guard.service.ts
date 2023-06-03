import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class RoleGuardService implements CanActivate {


  constructor(private userService: UsersService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    /* const userType = this.userService.getSession('userDetails').userType;

    if (userType === next.data.role) {
      return true;
    } */
    return false;

    // navigate to not found page
  //  this._router.navigate(['/404']);
  }

}
