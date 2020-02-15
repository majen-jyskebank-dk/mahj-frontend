import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarBrand = '';
  showNavbar = false;

  constructor(private authenticationService: AuthenticationService) {
    if (authenticationService.currentUserValue) {
      this.showNavbar = true;
    }

    this.navbarBrand = environment.appBrand;
  }

  ngOnInit(): void {
  }

}
