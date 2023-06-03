
import { Router, CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, public authService: AuthService, public snackBar: MatSnackBar) {

   }

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean{

    if (sessionStorage.getItem('userDetails')){
      return true;
    }else{

      this.router.navigate(['/login']).then(() => {
         return this.showToast('Kindly Login to Proceed');
      }).then(() => {
        return false;
      });
      
      }

    }

    showToast(message): void{
      this.snackBar.open(message, 'Info', {
        duration: 3000,
        
      });
      }

    }
