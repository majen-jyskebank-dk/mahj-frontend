import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private navbarStatusSubject: BehaviorSubject<boolean>;
  public navbarStatus: Observable<boolean>;

  constructor() {
    this.navbarStatusSubject = new BehaviorSubject<boolean>(false);
    this.navbarStatus = this.navbarStatusSubject.asObservable();
  }

  set status(value: boolean) {
    this.navbarStatusSubject.next(value);
  }
}
