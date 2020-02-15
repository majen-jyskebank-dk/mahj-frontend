import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WolDeviceComponent } from './wol-device/wol-device.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WolDeviceComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
