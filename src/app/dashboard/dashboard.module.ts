import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WolDeviceComponent } from './wol-device/wol-device.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: `${ environment.backendUrl }/${ environment.socketPath }`,
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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
