import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { WolDevice } from './wol-device.model';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit, OnDestroy {
  @Input() wolDevice: WolDevice;
  @Input() observableSocket: Observable<Socket>;
  private socket: Socket;
  editable = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.wolDevice.status = 'pending';

    this.observableSocket.subscribe({
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
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  get statusCss(): string {
    switch (this.wolDevice.status) {
      case 'online': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'offline': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  set icon(value: string) {
    this.wolDevice.icon = value;
  }

  set canEdit(value: boolean) {
    this.editable = value;
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
