import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/accounts/register/', {
      username,
      email,
      password
    }).pipe(
      tap((response: any) => {
        this.tokenService.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  login(username:string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/accounts/login/', {
      username,
      email,
      password
    }).pipe(
      tap((response: any) => {
        this.tokenService.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:8000/api/accounts/user/').pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}