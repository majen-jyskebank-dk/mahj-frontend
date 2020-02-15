import { Component, OnInit, Input } from '@angular/core';
import { WolDevice } from './wol-device.model';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit {
  @Input() wolDevice: WolDevice;

  constructor() { }

  ngOnInit(): void {
  }

  get statusCss(): string {
    switch(this.wolDevice.status) {
      case 'online': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'offline': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  get isOnline(): boolean {
    return this.wolDevice.status === 'online';
  }
}
