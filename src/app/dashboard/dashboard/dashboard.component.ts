import { Component, OnInit } from '@angular/core';
import { WolDeviceService } from '../wol-device/wol-device.service';
import { WolDevice } from '../wol-device/wol-device.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  wolDevices: WolDevice[];

  /*
    wolDevices: WolDevice[] = [
    new WolDevice('0', 'Desktop', '192.168.1.6', 'desktop_windows', 'pending', false),
    new WolDevice('1', 'Raspberry PI', '192.168.1.3', 'storage', 'online', true),
    new WolDevice('2', 'Server', '192.168.1.11', 'storage', 'offline', true)];
  */

  constructor(private wolDeviceService: WolDeviceService) { }

  ngOnInit() {
    this.wolDeviceService.wolDevices.subscribe(
      wolDevices => {
        this.wolDevices = wolDevices;
      },
      error => {
        console.error(error);
      }
    );
  }

  wakeWolDevice(_id: String) { }
}
