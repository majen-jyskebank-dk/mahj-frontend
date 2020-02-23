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
  socket: Observable<Socket>;
  wolDevices: WolDevice[];

  constructor(
    // tslint:disable-next-line: variable-name
    private _socket: Socket,
    private wolDevicesService: WolDevicesService,
    private authenticationService: AuthenticationService
  ) {
    this.socketSubject = new BehaviorSubject(null);
    this.socket = this.socketSubject.asObservable();
  }

  ngOnInit() {
    this._socket.emit('authenticate', { token: this.authenticationService.currentUserValue });

    this._socket.on('connect', () => {
      this._socket.on('authenticated', () => {
        this.socketSubject.next(this._socket);
      });

      this._socket.on('unauthorized', () => {
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

  wakeWolDevice(id: string) { }
}
