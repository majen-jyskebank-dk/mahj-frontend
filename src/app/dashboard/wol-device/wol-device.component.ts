import { Component, OnInit, Input } from '@angular/core';
import { WolDevice } from './wol-device.model';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit {
  @Input() wolDevice: WolDevice;
  // tslint:disable-next-line: variable-name
  @Input() _socket: Observable<Socket>;
  private socket: Socket;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this._socket.subscribe({
      next: socket => {
        if (socket !== null) {
          this.socket = socket;
          socket.on('statusUpdate', (data: any) => {
            if (this.wolDevice._id === data._id) {
              this.wolDevice.status = data.isAwake ? 'online' : 'offline';
            }
          });
        }
      }
    });

    this.wolDevice.status = 'pending';
  }

  get statusCss(): string {
    switch (this.wolDevice.status) {
      case 'online': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'offline': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  get isOnline(): boolean {
    return this.wolDevice.status === 'online';
  }

  get isPending(): boolean {
    return this.wolDevice.status === 'pending';
  }

  get isOffline(): boolean {
    return this.wolDevice.status === 'offline';
  }

  async wakeWolDevice() {
    this.wolDevice.status = 'pending';
    this.socket.emit('wakeWolDevice', { _id: this.wolDevice._id });

    for (let i = 0; i < environment.pollTries; i++) {
      if (this.wolDevice.status !== 'pending') {
        return;
      }

      await this.sleep(1000);
    }

    this.wolDevice.status = 'offline';
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
