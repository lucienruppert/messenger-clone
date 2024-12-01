import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environment';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private baseUrl: string = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn$.next(isLoggedIn);
  }

  public async login(email: string, password: string): Promise<User> {
    const formData = this.getFormData(email, password);
    try {
      const result$ = this.http.post<User>(`${this.baseUrl}/login`, formData);
      const userData = await firstValueFrom(result$);
      this.setSessionState(true);
      this.router.navigate(['/dashboard']);
      return userData;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error['errors'])
        throw typedError.error['errors'].join(' ');
      return typedError.error['errors'];
    }
  }

  private getFormData(email: string, password: string): FormData {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return formData;
  }

  private setSessionState(isLoggedIn: boolean): void {
    sessionStorage.setItem('isLoggedIn', isLoggedIn.toString());
    this.isLoggedIn$.next(isLoggedIn);
  }

  public logout(): void {
    this.logoutonClient();
    this.logoutOnServer();
    this.router.navigate(['/']);
  }

  public logoutonClient(): void {
    this.setSessionState(false);
  }

  public async logoutOnServer(): Promise<void> {
    try {
      const result$ = this.http.post(`${this.baseUrl}/logout`, {});
      const response = await firstValueFrom(result$);
      console.log(response);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
