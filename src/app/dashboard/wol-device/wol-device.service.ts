import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { WolDevice } from './wol-device.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WolDeviceService implements OnInit, OnDestroy{
  private _wolDevicesSocket = this.socket.fromEvent<WolDevice[]>('wolDevices');
  private _wolDevices: WolDevice[];
  wolDevices: Subject<WolDevice[]>;

  constructor(private socket: Socket) { }
  
  ngOnInit() {
    this._wolDevicesSocket.subscribe({
      next: (data) => {
        this.wolDevices.next(data);
        this._wolDevices = data;
      }
    });
  }

  ngOnDestroy() { }

  pingWolDevice(_id: string) {
    this.socket.emit('pingWolDevice', { _id });
  }

  wakeWolDevice(_id: string) {
    this.socket.emit('wakeWolDevice', { _id });
    this._wolDevices.forEach((wolDevice, index, array) => { 
      if (wolDevice.id == _id) {
        array[index].status = 'pending';
        this.wolDevices.next(array);
        return;
      }
    });
  }
}
