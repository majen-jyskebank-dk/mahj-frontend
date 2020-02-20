import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { NavbarService } from '../app-routing/navbar/navbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authenticationSerivce.currentUserValue;
      if (currentUser) {
        this.navbarService.status = true;
        return true;
      }

      this.navbarService.status = false;
      this.rotuer.navigate(['/login']);
      return false;
    }

  constructor(
    private rotuer: Router,
    private authenticationSerivce: AuthenticationService,
    private navbarService: NavbarService
  ) { }
}
