/* eslint-disable @typescript-eslint/member-ordering */
import { AuthResponse } from './../../shared/models/auth';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public login(emailUser: string, pass: string): Observable<AuthResponse> {
    const url = `${environment.api}/auth/signin`;
    const data = {
      username: emailUser,
      password: pass,
    };

    return this.http.post<AuthResponse>(url, data).pipe(
      tap(res => this.isLoggedIn.next(!!res?.accessToken && !!res?.refreshToken)),
      tap(res => this.saveAuthData(res?.accessToken, res?.refreshToken))
    );
  }

  public logout(): void {
    this.isLoggedIn.next(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private saveAuthData(accessToken?: string, refreshToken?: string): void {
    if (!accessToken || !refreshToken) {
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
}
