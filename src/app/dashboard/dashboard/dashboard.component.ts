import { Component, OnInit } from '@angular/core';
import { WolDevice } from '../wol-device/wol-device.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  wolDevices: WolDevice[] = [
    new WolDevice('0', 'Desktop', '192.168.1.6', 'desktop_windows', 'pending', false),
    new WolDevice('1', 'Raspberry PI', '192.168.1.3', 'storage', 'online', true),
    new WolDevice('2', 'Server', '192.168.1.11', 'storage', 'offline', true)];

  constructor() { }

  ngOnInit(): void {
  }
}
