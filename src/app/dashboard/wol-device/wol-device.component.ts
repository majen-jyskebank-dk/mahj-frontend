import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WolDevice } from './wol-device.model';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-wol-device',
  templateUrl: './wol-device.component.html',
  styleUrls: ['./wol-device.component.css']
})
export class WolDeviceComponent implements OnInit {
  @Input() wolDevice: WolDevice;
  @Input() index: number;
  @Input() observableSocket: Observable<Socket>;
  @Output() requestDelete = new EventEmitter<number>();
  private socket: Socket;

  editForm: FormGroup;
  editable = false;
  updateSubmitted = false;
  deleteSubmitted = false;

  constructor(private formBuilder: FormBuilder, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: [this.wolDevice.name || '', Validators.required],
      macAddress: [this.wolDevice.macAddress || '', Validators.required],
      localIpAddress: [this.wolDevice.localIpAddress || '', Validators.required],
      externalIpAddress: [this.wolDevice.externalIpAddress || '']
    });

    this.wolDevice.status = this.wolDevice.status || 'pending';
    if (this.wolDevice.status !== 'pending') {
      this.editable = true;
    }

    this.observableSocket.subscribe({
      next: socket => {
        if (socket !== null) {
          this.socket = socket;
          if (this.wolDevice._id) {
            this.bindToUpdates();
          }
        }
      }
    });
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

  get sanitizedUrl(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('ssh://' + this.wolDevice.externalIpAddress);
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.updateSubmitted = true;

    this.wolDevice.name = this.f.name.value;
    this.wolDevice.localIpAddress = this.f.localIpAddress.value;
    this.wolDevice.macAddress = this.f.macAddress.value;
    this.wolDevice.externalIpAddress = this.f.externalIpAddress.value;

    if (this.wolDevice._id === '') {
      this.socket.emit('createWolDevice', this.wolDevice);

      this.socket.once('createdWolDevice', (deviceId: any) => {
        this.wolDevice._id = deviceId._id;
        this.wolDevice.status = 'pending';
        this.updateSubmitted = false;
        this.editable = false;
        this.bindToUpdates();
      });
    } else {
      this.socket.emit('updateWolDevice', this.wolDevice);

      this.socket.once('updatedWolDevice', (wolDevice: WolDevice) => {
        this.updateSubmitted = false;
        this.editable = false;
      });
    }
  }

  onDelete() {
    if (this.wolDevice._id !== '') {
      this.deleteSubmitted = true;
      this.socket.emit('deleteWolDevice', this.wolDevice);

      this.socket.once('deletedWolDevice', (data) => {
        if (data._id === this.wolDevice._id) {
          this.requestDelete.emit(this.index);
        }
      });
    } else {
      this.requestDelete.emit(this.index);
    }
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

  private bindToUpdates() {
    this.socket.on('statusUpdate', (data: any) => {
      if (this.wolDevice._id === data._id) {
        this.wolDevice.status = data.isAwake ? 'online' : 'offline';
      }
    });
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
