import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WolDevice } from './wol-device.model';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit, OnDestroy {
  @Input() wolDevice: WolDevice;
  @Input() observableSocket: Observable<Socket>;
  private socket: Socket;

  editForm: FormGroup;
  editable = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.wolDevice.status = 'pending';

    this.editForm = this.formBuilder.group({
      name: [this.wolDevice.name || '', Validators.required],
      macAddress: [this.wolDevice.macAddress || '', Validators.required],
      localIpAddress: [this.wolDevice.localIpAddress || '', Validators.required],
      sshEnabled: [this.wolDevice.sshEnabled || false, Validators.required]
    });

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

  get f() {
    return this.editForm.controls;
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.wolDevice.name = this.f.name.value;
    this.wolDevice.localIpAddress = this.f.localIpAddress.value;
    this.wolDevice.macAddress = this.f.macAddress.value;
    this.wolDevice.sshEnabled = this.f.sshEnabled.value;

    this.editable = false;
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
