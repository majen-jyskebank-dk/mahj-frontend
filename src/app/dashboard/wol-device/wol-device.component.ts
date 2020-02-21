import { Component, OnInit, Input } from '@angular/core';
import { WolDevice } from './wol-device.model';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit {
  @Input() wolDevice: WolDevice;

  constructor(private socket: Socket, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.wolDevice.status = 'pending';

    console.log(JSON.stringify(this.wolDevice));

    this.socket.on('statusUpdate', (data: any) => {
      if (data._id === this.wolDevice._id) {
        console.log(`Received statusUpdate for ${this.wolDevice._id} with data: ${ JSON.stringify(data) }`);
        this.wolDevice.status = data.isAwake ? 'online' : 'offline';
      }
    });

    this.socket.emit('requestStatus', { token: this.authenticationService.currentUserValue, _id: this.wolDevice._id });
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
}
