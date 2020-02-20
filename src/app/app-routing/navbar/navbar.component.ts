import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarBrand = '';
  showNavbar = false;

  constructor(private authenticationService: AuthenticationService, private navbarService: NavbarService) {
    this.navbarBrand = environment.appBrand;
    navbarService.navbarStatus.subscribe({
      next: status => this.showNavbar = status
    });
  }

  ngOnInit(): void {
  }

  clickLogout() {
    this.authenticationService.logout();
  }
}
