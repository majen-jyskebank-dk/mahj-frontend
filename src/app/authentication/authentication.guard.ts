import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authenticationSerivce.currentUserValue;
      if (currentUser) {
        return true;
      }

      this.rotuer.navigate(['/login']);
      return false;
    }

  constructor(
    private rotuer: Router,
    private authenticationSerivce: AuthenticationService
  ) { }
}
