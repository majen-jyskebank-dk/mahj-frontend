import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  clear() {
    this.subject.next();
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.constructAlert(message, 'success', keepAfterRouteChange);
  }

  error(message: string, keepAfterRouteChange = false) {
    this.constructAlert(message, 'error', keepAfterRouteChange);
  }

  private constructAlert(message: string, type: string, keepAfterRouteChange: boolean) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type, text: message });
  }
}
