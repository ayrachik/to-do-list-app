import { Injectable } from '@angular/core';
import { CanLoad, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canLoad(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      tap(isLogged => {
        if (!isLogged) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
  canActivate(): Observable<boolean> {
    return this.canLoad();
  }


}
