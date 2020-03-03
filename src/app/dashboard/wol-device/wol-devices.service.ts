import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WolDevicesService {

  constructor(private http: HttpClient) { }

  get wolDevices(): Observable<any> {
    return this.http.get<any>(`${ environment.backendUrl }/${ environment.apiPath }/wolDevices`)
      .pipe(map((data) => {
        return data.response;
      }));
  }
}
