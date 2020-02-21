import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WolDevice } from './wol-device.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WolDevicesService {

  constructor(private http: HttpClient) { }

  get wolDevices(): Observable<any> {
    console.log('In get');

    return this.http.get<any>(`${ environment.apiUrl }/wolDevices`)
      .pipe(map((data) => {
        console.log(JSON.stringify(data.response));
        return data.response;
      }));
  }
}
