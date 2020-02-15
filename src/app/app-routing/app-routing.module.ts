import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../authentication/login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { AuthenticationGuard } from '../authentication/authentication.guard';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: environment.enableDebug}
    )],
  declarations: [ NavbarComponent ],
  exports: [
    CommonModule,
    RouterModule,
    NavbarComponent
  ]
})
export class AppRoutingModule { }
