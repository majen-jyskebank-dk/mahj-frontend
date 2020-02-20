import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/user/user.model';
import { NavbarService } from '../app-routing/navbar/navbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private navbarService: NavbarService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${ environment.apiUrl }/authentication/login`, { username, password })
      .pipe(map(res => {
        localStorage.setItem('currentUser', JSON.stringify(res.response));
        this.currentUserSubject.next(res.response);
        return res.response;
      }));
  }

  public logout() {
    localStorage.removeItem('currentUser');
    this.navbarService.status = false;
    this.currentUserSubject.next(null);
  }
}
