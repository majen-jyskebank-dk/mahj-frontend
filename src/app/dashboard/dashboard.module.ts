import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WolDeviceComponent } from './wol-device/wol-device.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:4300',
  options: { }
};

@NgModule({
  declarations: [
    DashboardComponent,
    WolDeviceComponent
  ],
  imports: [
    CommonModule,
    SocketIoModule.forRoot(config),
  ]
})
export class DashboardModule { }
