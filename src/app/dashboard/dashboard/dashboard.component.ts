import { Component, OnInit } from '@angular/core';
import { WolDevice } from '../wol-device/wol-device.model';
import { WolDevicesService } from '../wol-device/wol-devices.service';
import { first } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private socketSubject: BehaviorSubject<Socket>;
  observableSocket: Observable<Socket>;
  wolDevices: WolDevice[];

  constructor(
    private socket: Socket,
    private wolDevicesService: WolDevicesService,
    private authenticationService: AuthenticationService
  ) {
    this.socketSubject = new BehaviorSubject(null);
    this.observableSocket = this.socketSubject.asObservable();
  }

  ngOnInit() {
    this.socket.connect();
    this.socket.emit('authenticate', { token: this.authenticationService.currentUserValue });

    this.socket.on('connect', () => {
      this.socket.on('authenticated', () => {
        this.socketSubject.next(this.socket);
      });

      this.socket.on('unauthorized', () => {
        this.authenticationService.logout();
      });
    });

    this.wolDevicesService.wolDevices
      .pipe(first())
      .subscribe(
        data => {
          this.wolDevices = data;
        }
      );
  }

  createWolDevice() {
    this.wolDevices.push(new WolDevice());
  }

  deleteWolDevice(index: number) {
    delete this.wolDevices[index];
  }
}
