import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let error;

            switch (err.status) {
                case 400: // Bad username/password
                    error = 'Incorrect username or password';
                    break;
                case 401: // Not authorized
                    this.authenticationService.logout();
                    location.reload();
                    error = 'Unautorized';
                    break;
                default:
                    error = err.error.message || err.statusText;
                    break;
            }

            return throwError(error);
        }));
    }
}
