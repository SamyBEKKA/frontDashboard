import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export function authInterceptor (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // if (error.status === 401) {
      //   authService.logout();
      // }
      return throwError(error);
    })
  );
};
